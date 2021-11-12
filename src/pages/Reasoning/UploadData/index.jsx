import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
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
import axios from "axios";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";
import TextArea from "antd/es/input/TextArea";

class UploadData extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "12" });

    this.state = {
      show: false,
      loading: false,
      datasource: [],
    };
  }

  getData = () => {
    const formData = new FormData();
    formData.append("page", "1");
    formData.append("page_length", "10");
    this.setState({
      loading: true,
    });
    axios
      .post(api.findList, formData)
      .then((r) => {
        const { data } = r.data;
        if (r.data.retcode !== 0) {
          message.error(r.data.retmsg);
          return;
        }
        const datasource = data.map((v, i) => {
          return {
            ...v,
            upload_time: new Date(v.f_create_time * 1000).toLocaleString(),
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

  componentDidMount() {
    this.getData();
  }

  render() {
    const { show, loading, datasource } = this.state;
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
              <Button type={"primary"}>下载</Button>
              <Popconfirm
                title="确定删除本条信息?"
                onConfirm={() => {
                  const formData = new FormData();
                  formData.append("id", all.f_id);
                  axios
                    .post(api.delPredict, formData)
                    .then((r) => {
                      if (r.data.retcode !== 0) {
                        message.error("删除失败" + r.data.retmsg);
                        return;
                      }
                    })
                    .finally(() => {
                      this.getData();
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
          上传
        </Button>
        <Table
          loading={loading}
          size={"middle"}
          style={{ marginTop: "1vh" }}
          dataSource={datasource}
          columns={COLUMNS}
          bordered
        />
        <Modal
          title="数据上传"
          visible={show}
          onCancel={() => {
            this.setState({
              show: false,
            });
          }}
          width={"33vw"}
          footer={null}
          destroyOnClose
        >
          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 24 }}
            onFinish={(e) => {
              console.log(e);
              const { datasource } = this.state;
              const data = [...datasource];
              data.push({
                index: data.length + 1,
                service_id: e.service_id,
                note: e.note,
                upload_time: new Date(),
                status: "完成",
                key: data.length + 1,
              });
              message.success("上传成功");
              this.setState({
                datasource: data,
                show: false,
              });
            }}
            layout={"vertical"}
          >
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="service_id"
                  label={<div style={fontStyle}>service_id</div>}
                  rules={[{ required: true, message: "请输入service_id" }]}
                >
                  <Input placeholder={"请输入service_id"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="file"
                  label={<div style={fontStyle}>预测样本</div>}
                  beforeUpload={() => {
                    return false;
                  }}
                  rules={[{ required: true, message: "请上传预测样本后重试" }]}
                >
                  <Upload
                    beforeUpload={() => {
                      return false;
                    }}
                    style={{ width: "10px" }}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>
                      上传预测样本 (Max: 1)
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="note"
                  label={<div style={fontStyle}>数据信息</div>}
                  rules={[{ required: true, message: "请输入数据信息" }]}
                >
                  <TextArea
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    placeholder={"请输入数据信息"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify={"end"}>
              <Space>
                <Col>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        this.setState({
                          show: false,
                        });
                      }}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      执行
                    </Button>
                  </Form.Item>
                </Col>
              </Space>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default UploadData;
