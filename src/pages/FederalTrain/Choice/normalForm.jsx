import React, { Component } from "react";
import { Form, Input, Button, message, Space, Radio } from "antd";
import { withRouter } from "react-router-dom";

class NormalForm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // 表单样式
    const tailLayout = {
      wrapperCol: { offset: 9 },
    };
    // 表单样式
    const layout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 8 },
    };
    return (
      <Form
        size={"middle"}
        onFinish={e => {
          console.log(e);
          const formData = new FormData();
          formData.append("train_name", "123");
        }}
        {...layout}
      >
        <Form.Item name="trainName" label="任务名称">
          <Input />
        </Form.Item>

        <Form.Item name="trainType" label="任务类型" initialValue="single">
          <Radio.Group>
            <Radio value={"single"}>单机</Radio>
            <Radio value={"multi"}>多机</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="algorithm" label="采用算法">
          <Input />
        </Form.Item>

        <Form.Item name="algorithmParms" label="算法参数">
          <Input.TextArea style={{ resize: "none", height: "100px" }} />
        </Form.Item>

        <Form.Item name="isScale" label="isScale" initialValue="true">
          <Radio.Group>
            <Radio value={"true"}>是</Radio>
            <Radio value={"false"}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="postScript" label="备注信息">
          <Input.TextArea style={{ resize: "none" }} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <a
            style={{ textDecorationStyle: "none" }}
            onClick={() => {
              this.props.changeForm();
            }}
          >
            高级配置
          </a>
        </Form.Item>

        <Form.Item {...tailLayout} style={{ marginTop: "10vh" }}>
          <Space size={200}>
            <Button
              style={{ background: "rgb(201,201,201)" }}
              onClick={() => {
                this.props.history.push({
                  pathname: "/federalTrain/result",
                });
              }}
              size="large"
            >
              上一步
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  }
}
export default withRouter(NormalForm);
