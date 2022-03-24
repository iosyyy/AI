import React, { Component } from "react";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import FileSaver from "file-saver";

import axios from "axios";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";
const { Option } = Select;
const Menus = (props) => {
  const { all } = props;
  return (
    <div
      style={{
        background: "#fff",
        padding: "10px",
        borderRadius: "0.5rem",
      }}
    >
      <Row>
        <Button
          type={"link"}
          onClick={() => {
            axios
              .post(api.downloadTemplate, { file_name: all.f_data_path })
              .then((r) => {
                const { code } = r.data;
                if (code !== 0) {
                  message.error("当前文件下载错误请重试");
                  return;
                }
                const { data } = r.data;

                const exportContent = "\uFEFF";
                const blob = new Blob([exportContent + data], {
                  type: "text/plain;charset=utf-8",
                });
                const regFile = /[/][\S\s]*[/]/i;
                const curFile = all.f_data_path.replace(regFile, "");
                FileSaver.saveAs(blob, curFile);
              })
              .catch((r) => {
                message.error("文件下载失败请重试并检查网络连接");
              });
          }}
        >
          下载预测源文件
        </Button>
      </Row>
      <Row>
        <Button
          type={"link"}
          onClick={() => {
            axios
              .post(api.downloadTemplate, { file_name: all.f_score_path })
              .then((r) => {
                const { code } = r.data;
                if (code !== 0) {
                  message.error("当前文件下载错误请重试");
                  return;
                }
                const { data } = r.data;

                const exportContent = "\uFEFF";
                const blob = new Blob([exportContent + data], {
                  type: "text/plain;charset=utf-8",
                });
                const regFile = /[/][\S\s]*[/]/i;
                const curFile = all.f_data_path.replace(regFile, "");
                FileSaver.saveAs(blob, curFile);
              })
              .catch((r) => {
                message.error("文件下载失败请重试并检查网络连接");
              });
          }}
        >
          下载预测结果文件
        </Button>
      </Row>
    </div>
  );
};
class BatchInterface extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "10" });

    this.state = {
      show: false,
      loading: false,
      file_path: null,
      datasource: [],
      pageSize: 0,
      currentPage: 1,
      serviceIdList: [],
    };
  }

  getData = (page) => {
    this.setState({ loading: true });
    axios
      .post(api.findPredict, { page, page_length: 10 })
      .then((r) => {
        const { data, code, msg } = r.data;
        if (code !== 0) {
          message.error(msg);
          return;
        }
        this.setState({ pageSize: data.count });
        const datasource = data.data.map((v, i) => {
          return {
            ...v,
            upload_time: new Date(v.f_update_time).toLocaleString(),
            key: i,
          };
        });
        this.setState({
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

  getServiceIdList = () => {
    axios
      .get(api.findDeployListStatus1)
      .then((r) => {
        const { data, code, msg } = r.data;
        if (code !== 0) {
          message.error(msg);
          return;
        }
        console.log(r);

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
  componentDidMount() {
    this.getData(1);
    this.getServiceIdList();
  }

  render() {
    const { show, loading, datasource, file_path, serviceIdList } = this.state;
    const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };
    const COLUMNS = [
      {
        title: "序号",
        dataIndex: "f_id",
        key: "f_id",
      },
      {
        title: "service_id",
        dataIndex: "f_service_id",
        key: "f_service_id",
      },
      {
        title: "数据名称",
        dataIndex: "f_name",
        key: "f_name",
      },
      {
        title: "数据信息",
        dataIndex: "f_msg",
        key: "f_msg",
      },
      {
        title: "上传时间",
        dataIndex: "upload_time",
        key: "upload_time",
      },
      {
        title: "状态",
        dataIndex: "f_status",
        key: "f_status",
        render: (_v, x) => {
          return _v === "0" ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              成功
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              失败
            </Tag>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        render: (_v, all) => {
          return (
            <Space>
              <Dropdown overlay={<Menus all={all} />} placement="bottomCenter">
                <Button type={"primary"}>下载</Button>
              </Dropdown>

              <Popconfirm
                title="确定删除本条信息?"
                onConfirm={() => {
                  axios
                    .post(api.delPredictBatch, { id: all.f_id })
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
        <Table
          loading={loading}
          size={"middle"}
          style={{ marginTop: "1vh" }}
          dataSource={datasource}
          columns={COLUMNS}
          bordered
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

export default BatchInterface;
