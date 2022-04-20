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
  Upload
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
  UploadOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";
import ModalGet from "../../NotifyReasoning/ModalGet";

let interval;
const { Step } = Steps;
const { Option } = Select;
class Model extends Component {
getServiceIdList = () => {
    axios
      .get(api.findDeployListStatus1)
      .then((r) => {
        const { data, code, msg } = r.data;
        if (code !== 0) {
          message.error(msg);
          return;
        }

        const serviceIdList = data.data.map((v, i) => {
          return v.f_service_id;
        });
        this.setState({
          serviceIdList,
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
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "8" });

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
      file_path: null,
      currentPage: 1,
      text: "",
      selectId: {
        service_id: "",
      },
      modalShow: false,
      searchData: {
        status: "",
        service_id: "",
        model_id: "",
      },
      serviceIdList: [],
    };
  }

  setModalShow = (modalShow) => {
    this.setState({
      modalShow,
    });
  };

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

  setModalLoadingAndShow = (loading, modalShow) => {
    this.setState({
      loading,
      modalShow,
    });
  };
  componentDidMount() {
    this.getData(1);
    this.getServiceIdList();
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

  COLUMNS = [
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
          <Space>
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
            <Button
              onClick={() => {
                this.setState({
                  modalShow: true,
                  selectId: {
                    service_id: y.service_id,
                  },
                });
              }}
              disabled={y.status !== "1" && y.status !== "3"}
              style={{ background: "rgb(109,218,99)", color: "#fff" }}
              type={"primary"}
            >
              预测
            </Button>
            <Button
              onClick={() => {
                axios
                  .post(api.updateStatus, {
                    service_id: y.service_id,
                    status: 0,
                  })
                  .then((r) => {
                    const { code, msg } = r.data;

                    if (code !== 0) {
                      message.error("重新上传失败" + msg);
                    } else {
                      message.success("重新上传成功");
                    }
                  })
                  .catch((r) => {
                    message.error("服务器异常");
                  })
                  .finally(() => {
                    this.getData(this.state.currentPage);
                  });
              }}
              disabled={y.status !== "1" && y.status !== "3"}
            >
              重新上传
            </Button>
            <Popconfirm
              title="确定删除本条信息?"
              onConfirm={() => {
                axios
                  .post(api.delDeploy, { id: y.index })
                  .then((r) => {
                    const { code, msg } = r.data;

                    if (code !== 0) {
                      message.error("删除失败" + msg);
                    }
                  })
                  .finally(() => {
                    this.getData(this.state.currentPage);
                  });
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button danger type={"primary"}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  render() {
    const {
      show,
      loading,
      datasource,
      showDetail,
      statusNow,
      nows,
      percent,
      text,
      selectId,
      modalShow,
      serviceIdList,
      file_path
    } = this.state;

    return (
      <div>
        <Button
          onClick={() => {
            this.setState({
              show: true,
            });
          }}
        >
          新增部署任务
        </Button>
        <ModalGet
          show={modalShow}
          selectId={selectId}
          loading={loading}
          setShow={this.setModalShow}
          setLoadingAndShow={this.setModalLoadingAndShow}
          history={this.props.history}
        />
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
          columns={this.COLUMNS}
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
        <Modal
          title="部署任务"
          visible={show}
          onCancel={() => {
            this.setState({
              show: false,
              file_path: null,
            });
          }}
          style={{ top: 40 }}
          width={"45vw"}
          footer={null}
          destroyOnClose
        >
          <Form
            wrapperCol={{ span: 16 }}
            onFinish={(e) => {
              const { service_id, file, name, context } = e;
              const formData = new FormData();
              formData.append("service_id", service_id);
              formData.append("file", file.file);
              formData.append("name", name);
              formData.append("context", context);
              this.setState({
                loading: true,
              });
              axios
                .post(api.batchSingle, formData)
                .then((r) => {
                  const { code, msg } = r.data;
                  if (code === 0) {
                    message.success("批量处理完成");
                    // this.setState({
                    //   file_path: data.file_path,
                    // });
                  } else {
                    message.error(msg);
                  }
                })
                .catch((e) => {
                  message.error("批量处理失败");
                })
                .finally(() => {
                  this.setState({
                    loading: false,
                    show: false,
                  });
                  this.getData(this.state.currentPage);
                });
            }}
            layout={"vertical"}
          >
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label={<div style={fontStyle}>任务名称</div>}
                  rules={[{ required: true, message: "请输入任务名称" }]}
                >
                  <Input placeholder={"请输入任务名称"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="context"
                  label={<div style={fontStyle}>任务简介</div>}
                  rules={[{ required: true, message: "请输入任务简介" }]}
                >
                  <Input placeholder={"请输入任务简介"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="service_id"
                  label={<div style={fontStyle}>service_id</div>}
                  rules={[{ required: true, message: "请输入service_id" }]}
                >
                  <Select>
                    {serviceIdList.map((v, i) => {
                      return (
                        <Option key={`serviceId${i}`} value={v}>
                          {v}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/*<Row justify={"center"}>
              <Col span={14}>
                <Form.Item
                  name="feature"
                  label={<div style={fontStyle}>匹配样本的特征</div>}
                  rules={[{ required: true, message: "请输入特征" }]}
                >
                  <Input placeholder={"请输入特征"} />
                </Form.Item>
              </Col>
            </Row>*/}
            <Row gutter={[0, 30]} justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="file"
                  label={<div style={fontStyle}>预测样本</div>}
                  rules={[{ required: true, message: "请上传预测样本后重试" }]}
                >
                  <Upload
                    beforeUpload={() => {
                      return false;
                    }}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>
                      上传预测样本 (Max: 1)
                    </Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  label={<div style={fontStyle}>下载预测样本模板</div>}
                >
                  <Button
                    onClick={() => {
                      const href =
                        window.location.protocol +
                        "//" +
                        window.location.hostname +
                        ":9380" +
                        file_path;
                      FileSaver.saveAs(href);
                    }}
                    disabled={file_path == null}
                    icon={<DownloadOutlined />}
                  >
                    下载模板
                  </Button>
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

export default Model;
