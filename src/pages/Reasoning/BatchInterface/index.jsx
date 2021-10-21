import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Table,
  Upload,
} from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import api from "../../../config/api";
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
  },
];
class BatchInterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      datasource: [],
    };
  }

  render() {
    const { show, loading, datasource } = this.state;
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
          style={{ marginTop: "3vh" }}
          dataSource={datasource}
          columns={COLUMNS}
          bordered
          pagination={false}
        />
        <Modal
          title="项目查看"
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
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            onFinish={(e) => {
              const { service_id, file } = e;
              const formData = new FormData();
              formData.append("service_id", service_id);
              formData.append("file", file.file);
              axios
                .post(api.batchSingle, formData)
                .then((r) => {
                  console.log(r);
                  const { code, msg } = r.data;
                  if (code === 0) {
                    message.success("批量处理完成");
                  } else {
                    message.error(msg);
                  }
                })
                .catch((e) => {
                  console.log(e);
                  message.error("批量处理失败");
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
                  <Button icon={<DownloadOutlined />}>下载模板</Button>
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
