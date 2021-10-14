import React, { Component } from "react";
import { Button, Col, Form, Input, Modal, Row, Select, Table } from "antd";
import { fontStyle } from "../../../util/util";

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
  },
];
class Model extends Component {
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
                  name="service_id"
                  label={<div style={fontStyle}>service_id</div>}
                  rules={[{ required: true, message: "请输入service_id" }]}
                >
                  <Input placeholder={"请输入service_id"} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[0, 30]} justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="modelName"
                  label={<div style={fontStyle}>相关模型</div>}
                  rules={[{ required: true, message: "请输入相关模型" }]}
                >
                  <Input placeholder={"请输入相关模型"} />
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
