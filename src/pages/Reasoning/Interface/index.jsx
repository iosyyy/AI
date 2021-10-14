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
    const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };

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
                label={<div style={fontStyle}>service_id</div>}
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
                label={<div style={fontStyle}>模型版本</div>}
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
                label={<div style={fontStyle}>匹配样本的特征值</div>}
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
                label={<div style={fontStyle}>样本内容</div>}
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
