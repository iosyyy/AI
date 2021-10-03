import React, { Component } from "react";
import { Button, Col, Form, Input, Modal, Row, Table, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={(e) => {
              console.log(e);
            }}
            layout={"horizontal"}
          >
            <Row justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="任务名称"
                  rules={[{ required: true, message: "请输入任务名称" }]}
                >
                  <Input placeholder={"请输入任务名称"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="service_id"
                  label="service_id"
                  rules={[{ required: true, message: "请输入service_id" }]}
                >
                  <Input placeholder={"请输入service_id"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="feature"
                  label="匹配样本的特征"
                  rules={[{ required: true, message: "请输入特征" }]}
                >
                  <Input placeholder={"请输入特征"} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[0, 30]} justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="specimen"
                  label="预测样本"
                  beforeUpload={() => {
                    return false;
                  }}
                  rules={[{ required: true, message: "请上传预测样本后重试" }]}
                >
                  <Upload maxCount={1}>
                    <Button icon={<UploadOutlined />}>
                      上传预测样本 (Max: 1)
                    </Button>
                  </Upload>
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
