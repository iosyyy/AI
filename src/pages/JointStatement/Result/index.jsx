import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Space,
  Steps,
  Table,
} from "antd";
import axios from "axios";
import qs from "qs";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";
import { fontStyle } from "../../../util/util";
import {
  BoxPlotOutlined,
  BranchesOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

let interval;
const { Step } = Steps;

class JointStatementResult extends Component {
  constructor(props) {
    super(props);

    const columns = [
      {
        title: <div>ID</div>,
        dataIndex: "f_job_id",
        key: "f_job_id",
        width: "16vw",
        render: (id, obj) => (
          <div>
            <a
              style={{
                color: "rgb(65,89,209)",
              }}
              onClick={(_e) => {
                this.props.history.push({
                  pathname: "/federalDetail/show",
                  search: qs.stringify({
                    id: obj.f_job_id,
                    role: obj.f_initiator_role,
                    partyId: obj.f_party_id,
                    status: obj.f_status,
                    startTime: obj.f_create_time,
                    endTime: obj.f_end_time,
                    duration: obj.duration,
                  }),
                });
              }}
            >
              {id}
            </a>
          </div>
        ),
      },
      {
        title: <div>PartyID</div>,
        dataIndex: "f_party_id",
        key: "f_party_id",
        width: "8vw",
      },
      {
        title: <div>任务名称</div>,
        dataIndex: "f_name",
        key: "f_name",
        width: "8vw",
      },
      {
        title: <div>任务描述</div>,
        dataIndex: "f_description",
        key: "f_description",
        width: "8vw",
      },
      {
        title: <div>规则</div>,
        dataIndex: "f_initiator_role",
        key: "f_initiator_role",
        width: "8vw",
      },
      {
        title: <div>开始时间</div>,
        dataIndex: "f_create_time",
        key: "f_create_time",
        width: "7vw",

        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>结束时间</div>,
        dataIndex: "f_end_time",
        key: "f_end_time",
        width: "7vw",

        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>运行时间</div>,
        dataIndex: "duration",
        key: "elapsed",
        width: "4vw",

        render: (text, value) => {
          const time = value.f_end_time - value.f_create_time;
          const seconds = Math.round((time / 1000) % 60);
          const minutes = Math.round((time / 1000 / 60) % 60);
          const hour = Math.round((time / 1000 / 60 / 60) % 60);
          return (
            <>
              {`${hour < 10 ? `0${hour}` : hour}:${
                minutes < 10 ? `0${minutes}` : minutes
              }:${seconds < 10 ? `0${seconds}` : seconds}`}
            </>
          );
        },
      },
      {
        title: <div>结果</div>,
        dataIndex: "f_status",
        key: "f_status",
        width: "8vw",
      },
      {
        title: <div>操作</div>,
        dataIndex: "action",
        key: "action",
        render: (text, obj) => {
          return (
            <Space>
              {obj.f_status === "failed" ? <Button>重试</Button> : <></>}
              <Button
                onClick={() => {
                  this.setState({
                    id: obj.f_job_id,
                    show: true,
                  });
                }}
                type={"primary"}
              >
                部署
              </Button>
            </Space>
          );
        },
      },
    ];

    this.state = {
      columns,
      dataSource: [],
      show: false,
      loading: false,
      page_length: 0,
      currentPage: 1,
      id: "",
      showDetail: false,
      error: 0,
      datasource: [],
      statusNow: "error",
      nows: 0,
      percent: 0,
      pageSize: 0,
    };
  }

  componentDidMount() {
    PubSubJS.publish("isRunning", { page: "23" });

    this.getDataSource(1);
  }

  getDataSource = (page) => {
    this.setState({ loading: true });
    axios
      .post(api.jobList, this.getData(page))
      .then((r) => {
        if (r.data.code !== 0) {
          message.error(r.data.msg);
          return;
        }
        const { data, count } = r.data.data;
        this.setState({
          dataSource: data,
          page_length: count,
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.setState({
          loading: false,
          currentPage: page,
        });
      });
  };

  componentWillUnmount() {
    //处理逻辑
    this.setState = (_state, _callback) => {};
  }

  getData = (page) => {
    return {
      page: page,
      page_length: 20,
    };
  };

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
    const {
      show,
      id,
      loading,
      showDetail,
      statusNow,
      nows,
      percent,
    } = this.state;

    return (
      <div className="site-layout-content">
        <Table
          loading={this.state.loading}
          scroll={{ y: "65.5vh" }}
          bordered={false}
          size={"middle"}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={{
            showSizeChanger: false,
            pageSize: 20,
            position: ["bottomCenter"],
            size: "small",
            total: this.state.page_length,
            current: this.state.currentPage,
            onChange: (page, _pageSize) => {
              this.getDataSource(page);
            },
          }}
        />

        <Modal
          title="模型详情"
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
        </Modal>

        <Modal
          title="模型部署"
          visible={show}
          onCancel={() => {
            this.setState({
              show: false,
            });
          }}
          width={"45vw"}
          footer={null}
          destroyOnClose
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ job_id: id }}
            onFinish={(e) => {
              this.setState({
                loading: true,
              });
              axios
                .post(api.modelUpdate, e)
                .then((r) => {
                  const { code, msg, data } = r.data;
                  if (code !== 1) {
                    this.setState({
                      showDetail: true,
                      percent: 0,
                      nows: -1,
                      error: (data?.location ?? 0 / 3.0) * 100,
                      statusNow: "active",
                    });
                  }
                  if (code === 1) {
                    message.error(msg);
                    return;
                  }
                  this.modelUpload();
                })
                .finally(() => {
                  this.setState({
                    loading: false,
                    show: false,
                  });
                  this.getDataSource(this.state.currentPage);
                });
            }}
            layout={"horizontal"}
          >
            {/*<Row justify={"center"}>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item*/}
            {/*      name="service_id"*/}
            {/*      label={<div style={fontStyle}>service_id</div>}*/}
            {/*      rules={[{ required: true, message: "请输入service_id" }]}*/}
            {/*    >*/}
            {/*      <Input placeholder={"请输入service_id"} />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            <Row gutter={[0, 0]} justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="job_id"
                  label={<div style={fontStyle}>相关模型</div>}
                  rules={[{ required: true, message: "请输入相关模型" }]}
                >
                  <Input placeholder={"请输入相关模型"} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[0, 30]} justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="context"
                  label={<div style={fontStyle}>备注</div>}
                  rules={[{ required: true, message: "请输入备注" }]}
                >
                  <Input placeholder={"请输入备注"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col>
                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default JointStatementResult;
