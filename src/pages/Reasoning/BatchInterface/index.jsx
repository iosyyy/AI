import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
  Upload,
} from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import FileSaver from "file-saver";

import axios from "axios";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";
const COLUMNS = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "任务名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "关联模型",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    render: () => {
      return (
        <Space>
          <Button type={"primary"}>下载</Button>
          <Button danger type={"primary"}>
            删除
          </Button>
        </Space>
      );
    },
  },
];
class BatchInterface extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "10" });

    this.state = {
      show: false,
      loading: false,
      file_path: null,
      datasource: [
        {
          key: 1,
          index: 1,
          name: "modelUploadTest1",
          model: 151500,
          status: "成功",
        },
        {
          key: 2,
          index: 2,
          name: "modelUploadTest10086",
          model: 151566,
          status: "成功",
        },
        {
          key: 3,
          index: 3,
          name: "modelUploadTest2",
          model: 151500,
          status: "失败",
        },
        {
          key: 4,
          index: 4,
          name: "modelUploadTest3",
          model: 151544,
          status: "成功",
        },
      ],
    };
  }

  render() {
    const { show, loading, datasource, file_path } = this.state;
    const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };

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
          size={"middle"}
          style={{ marginTop: "1vh" }}
          dataSource={datasource}
          columns={COLUMNS}
          bordered
        />
        <Modal
          title="项目查看"
          visible={show}
          onCancel={() => {
            this.setState({
              show: false,
              file_path: null,
            });
          }}
          width={"45vw"}
          footer={null}
          destroyOnClose
        >
          <Form
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            onFinish={(e) => {
              const { service_id, file } = e;
              const formData = new FormData();
              formData.append("service_id", service_id);
              formData.append("file", file.file);
              this.setState({
                loading: true,
              });
              axios
                .post(api.batchSingle, formData)
                .then((r) => {
                  console.log(r);
                  const data = r.data.data.data;
                  const { code, msg } = r.data;
                  if (code === 0) {
                    message.success("批量处理完成");
                    this.setState({
                      file_path: data.file_path,
                    });
                  } else {
                    message.error(msg);
                  }
                })
                .catch((e) => {
                  console.log(e);
                  message.error("批量处理失败");
                })
                .finally(() => {
                  this.setState({
                    loading: false,
                  });
                });
            }}
            layout={"horizontal"}
          >
            <Row justify={"center"}>
              <Col span={14}>
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
              <Col span={14}>
                <Form.Item
                  name="service_id"
                  label={<div style={fontStyle}>service_id</div>}
                  rules={[{ required: true, message: "请输入service_id" }]}
                >
                  <Input placeholder={"请输入service_id"} />
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
              <Col span={14}>
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
