import React, { Component } from "react";
import { Button, Form, InputNumber, Select, Tooltip } from "antd";
import PubSubJS from "pubsub-js";

class FederalTrainChoice extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.location.state };
  }

  onFinish = (values) => {
    PubSubJS.publish("trainChoice", {
      ...values,
      type: this.state.type,
      status: this.state.status,
    });
    this.props.history.push("/training");
  };

  render() {
    const tailLayout = {
      wrapperCol: { offset: 11, span: 8 },
    };
    const layout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 6 },
    };
    return (
      <div className="site-layout-content">
        <h1 className={"colorWhite"}>联邦训练</h1>
        <div
          style={{ textAlign: "center", marginBottom: "5vh", marginTop: "3vh" }}
        >
          模型参数选择
        </div>
        <Form layout="horizontal" onFinish={this.onFinish} {...layout}>
          <Tooltip
            placement="top"
            title="选择不同的优化器"
            color="#95DDDA"
            arrowPointAtCenter={true}
          >
            <Form.Item name="optimizer" label="优化器类型：" initialValue="sgd">
              <Select>
                <Select.Option value="sgd">sgd</Select.Option>
                <Select.Option value="adam">adam</Select.Option>
              </Select>
            </Form.Item>
          </Tooltip>

          <Form.Item
            name="local_ep"
            label="客户端学习："
            rules={[{ type: "number", min: 1, max: 1000 }]}
            initialValue={10}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="epochs"
            label="训练次数："
            rules={[{ type: "number", min: 1, max: 10 }]}
            initialValue={5}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item name="lr" label="学习率：" initialValue={0.01}>
            <InputNumber min={0} max={1} step={0.01} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FederalTrainChoice;
