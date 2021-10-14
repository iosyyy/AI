import React, { Component } from "react";
import { Button, Form, InputNumber, Select, Tooltip } from "antd";
import PubSubJS from "pubsub-js";
import { fontStyle } from "../../../util/util";

class Choice extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.location.state };
  }

  onFinish = (values) => {
    this.props.history.push({
      pathname: "/federalDetail/show",
      state: { id: "20232011" },
    });
    PubSubJS.publish("trainChoice", {
      ...values,
      type: this.state.type,
      status: this.state.status,
    });
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
      <div style={{ height: "85vh" }} className="site-layout-content">
        <h1 className="colorWhite">联邦攻防</h1>
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
            arrowPointAtCenter
          >
            <Form.Item
              name="optimizer"
              label={<div style={fontStyle}>优化器类型：</div>}
              initialValue="cnn"
            >
              <Select>
                <Select.Option value="cnn">cnn</Select.Option>
                <Select.Option value="mpl">mpl</Select.Option>
              </Select>
            </Form.Item>
          </Tooltip>

          <Form.Item
            name="local_ep"
            label={<div style={fontStyle}>客户端训练次数：</div>}
            rules={[{ type: "number", min: 1, max: 1000 }]}
            initialValue={10}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="iteration"
            label={<div style={fontStyle}>全局迭代次数：</div>}
            rules={[{ type: "number", min: 10, max: 20 }]}
            initialValue={10}
          >
            <InputNumber />
          </Form.Item>
          <Tooltip
            placement="top"
            title="选择不同的攻击类型"
            color="black"
            arrowPointAtCenter
          >
            <Form.Item
              name="attackType"
              label={<div style={fontStyle}>攻击类型：</div>}
              initialValue="type1"
            >
              <Select>
                <Select.Option value="type1">朴素free rider攻击</Select.Option>
                <Select.Option value="type2">
                  差分扰动free rider攻击(线性)
                </Select.Option>
                <Select.Option value="type3">
                  差分扰动free rider攻击(指数)
                </Select.Option>
              </Select>
            </Form.Item>
          </Tooltip>
          <Form.Item
            name="lr"
            label={<div style={fontStyle}>学习率：</div>}
            initialValue={0.01}
          >
            <InputNumber min={0} max={1} step={0.01} />
          </Form.Item>

          <Form.Item
            name="attacker"
            label={<div style={fontStyle}>攻击者数：</div>}
            rules={[{ type: "number", min: 1, max: 20 }]}
            initialValue={10}
          >
            <InputNumber />
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

export default Choice;
