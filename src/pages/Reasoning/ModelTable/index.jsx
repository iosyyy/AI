import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tag,
} from "antd";
import { fontStyle } from "../../../util/util";
import axios from "axios";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";
import {
  BoxPlotOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";

let interval;
const { Step } = Steps;
const { Option } = Select;
class ModelTable extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "30" });

    this.state = {
      show: false,
      loading: false,
      showDetail: false,
      error: 0,
      datasource: [],
      statusNow: "error",
      nows: 0,
      percent: 0,
      pageSize: 0,
      currentPage: 1,
      searchData: {
        status: "",
        service_id: "",
        model_id: "",
      },
      text: "",
    };
  }
  getData = (page) => {
    const { searchData } = this.state;
    this.setState({ loading: true });
    axios
      .post(api.findDeployConditionList, {
        page: page,
        page_length: 10,
        ...searchData,
      })
      .then((r) => {
        const { data, code, msg } = r.data;
        console.log(data);
        if (code !== 0) {
          message.error(msg);
          return;
        }

        const datasource = data.data.map((v, i) => {
          return {
            upload_time: new Date(v.f_create_time * 1000).toLocaleString(),
            key: i,
            index: v.f_id,
            model: v.f_model_id,
            text: v.f_context,
            service_id: v.f_service_id,
            statusNow: "success",
            msg: v.f_msg,
            percent: 100,
            nows: 2,
            status: v.f_status,
          };
        });
        this.setState({
          pageSize: data.count,
          datasource,
        });
      })
      .catch((r) => {
        message.error("服务器异常");
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };
  componentDidMount() {
    this.getData(1);
  }

  modelUpload = () => {
    const step1 = 33.3;
    const step2 = 66.6;
    const step3 = 100;
    const { error } = this.state;
    interval = setInterval(() => {
      const { percent, nows } = this.state;
      let per = percent;
      per += Math.random() * 3;
      if (per >= error) {
        if (per > step1) {
          this.setState({
            nows: 0,
            percent: step1,
          });
        }
        clearInterval(interval);
        this.setState({
          statusNow: "error",
        });
        message.error("模型部署失败请重试");
        return;
      }
      if (per > step1 && nows === -1) {
        per = step1;
        clearInterval(interval);

        interval = setTimeout(() => {
          this.setState({
            nows: 0,
          });
          message.success("模型部署完成");
          interval = setInterval(() => {
            const { percent, nows } = this.state;
            let per = percent;

            per += Math.random() * 5;
            if (per >= error) {
              if (per > step2) {
                this.setState({
                  nows: 1,
                  percent: step2,
                });
              }
              this.setState({
                statusNow: "error",
              });
              clearInterval(interval);
              message.error("模型发布失败请重试");
              return;
            }
            if (per > step2 && nows === 0) {
              per = step2;
              clearInterval(interval);

              interval = setTimeout(() => {
                message.success("模型发布完成");
                this.setState({
                  nows: 1,
                });
                let interval = setInterval(() => {
                  const { percent, nows } = this.state;
                  let per = percent;
                  per += Math.random() * 5;
                  if (per >= error) {
                    if (per > step3) {
                      this.setState({
                        nows: 2,
                        percent: step3,
                      });
                    }
                    this.setState({
                      statusNow: "error",
                    });
                    clearInterval(interval);
                    message.error("模型绑定失败请重试");
                    return;
                  }
                  if (per > step3 && nows === 1) {
                    per = step3;
                    clearInterval(interval);

                    message.success("模型绑定完成");
                    this.setState({
                      nows: 2,
                      statusNow: "process",
                    });
                  }
                  this.setState({
                    percent: Math.round(per * 10) / 10,
                  });
                }, step3);
              }, 3000);
            }
            this.setState({
              percent: Math.round(per * 10) / 10,
            });
          }, step3);
        }, 1500);
      }

      this.setState({
        percent: Math.round(per * 10) / 10,
      });
    }, step3);
  };

  render() {
    const COLUMNS = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
      },
      {
        title: "service_id",
        dataIndex: "service_id",
        key: "service_id",
      },
      {
        title: "关联模型",
        dataIndex: "model",
        key: "model",
      },

      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (_v, x) => {
          return _v === "0" ? (
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              未上传
            </Tag>
          ) : _v === "1" ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              已上传
            </Tag>
          ) : _v === "2" ? (
            <Tag icon={<CloseCircleOutlined />} color="error">
              部署失败
            </Tag>
          ) : (
            <Tag icon={<CheckCircleOutlined />} color="#108ee9">
              已预测
            </Tag>
          );
        },
      },
      {
        title: "上传时间",
        dataIndex: "upload_time",
        key: "upload_time",
      },
      {
        title: "操作",
        dataIndex: "action",
        render: (x, y) => {
          return (
            <Button
              onClick={() => {
                this.setState({
                  showDetail: true,
                  index: 0,
                  statusNow: y.statusNow,
                  percent: y.percent,
                  nows: y.nows,
                  text: y.text,
                });
              }}
              type={"primary"}
            >
              查看详情
            </Button>
          );
        },
      },
    ];
    const {
      loading,
      datasource,
      showDetail,
      statusNow,
      nows,
      percent,
      text,
    } = this.state;

    return (
      <div>
        <div style={{ float: "right" }}>
          <Form
            size="small"
            layout="inline"
            onFinish={(res) => {
              this.setState({
                searchData: {
                  status: res.status ? res.status : "",
                  service_id: res.service_id ? res.service_id : "",
                  model_id: res.model_id ? res.model_id : "",
                },
                currentPage: 1,
              });
              this.getData(1);
            }}
          >
            <Form.Item
              label={<div style={fontStyle}>service_id</div>}
              name="service_id"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<div style={fontStyle}>模型ID</div>}
              name="model_id"
            >
              <Input />
            </Form.Item>

            <Form.Item label={<div style={fontStyle}>状态</div>} name="status">
              <Select
                allowClear
                placeholder="选择状态"
                style={{ width: "8vw" }}
              >
                <Option value="0">未上传 </Option>
                <Option value="1">已上传</Option>
                <Option value="2">部署失败</Option>
                <Option value="3">已预测</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button shape={"round"} type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          loading={loading}
          style={{ marginTop: "1vh" }}
          dataSource={datasource}
          columns={COLUMNS}
          bordered
          size={"middle"}
          pagination={{
            showSizeChanger: false,
            pageSize: 10,
            total: this.state.pageSize,
            current: this.state.currentPage,
            onChange: (page, _pageSize) => {
              this.getData(page);
              this.setState({
                currentPage: page,
              });
            },
          }}
        />

        <Modal
          title="查看详情"
          visible={showDetail}
          onCancel={() => {
            this.setState({
              showDetail: false,
            });
            clearInterval(interval);
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  showDetail: false,
                });
                clearInterval(interval);
              }}
            >
              返回
            </Button>,
          ]}
          width={"45vw"}
          destroyOnClose
        >
          <div style={{ height: "15vh" }}>
            <Steps
              style={{ marginBottom: "3vh" }}
              current={nows}
              status={statusNow}
            >
              <Step icon={<BranchesOutlined />} title="部署" />
              <Step icon={<CloudUploadOutlined />} title="发布" />
              <Step icon={<BoxPlotOutlined />} title="绑定" />
            </Steps>
            <Progress
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
              percent={percent}
              status={statusNow}
            />
          </div>
          <div style={fontStyle}>备注: {text}</div>
        </Modal>
      </div>
    );
  }
}

export default ModelTable;
