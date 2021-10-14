import React, { Component } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";

class Interface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={(e) => {
            console.log(e);
          }}
          layout={"horizontal"}
        >
          <Row justify={"center"}>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="model_version"
                label="模型版本"
                rules={[{ required: true, message: "请输入模型版本" }]}
              >
                <Input placeholder={"请输入模型版本"} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Col span={8}>
              <Form.Item
                name="feature"
                label="匹配样本的特征值"
                rules={[{ required: true, message: "请输入特征值" }]}
              >
                <TextArea placeholder={"请输入特征值"} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[0, 30]} justify={"center"}>
            <Col span={8}>
              <Form.Item
                name="specimen"
                label="样本内容"
                rules={[{ required: true, message: "请输入样本内容" }]}
              >
                <TextArea placeholder={"请输入样本内容"} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Col>
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  执行
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Interface;
