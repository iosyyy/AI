import React, { Component } from "react";
import PubSubJS from "pubsub-js";
import { Button, Form, Image, Input, message } from "antd";
import axios from "axios";
import api from "../../../config/api";

class Comp extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "58" });
    this.formRef = React.createRef()
  }
  changeUserInfo = (values) => {
    axios
      .post(api.updateUserInfo, { ...values })
      .then((r) => {
        if (r.data.data.retcode || r.data.data.code) {
          message.error("服务验证失败,请重试");
        } else {
          message.success("修改成功");
          this.getUser();
        }
      })
      .catch((r) => {
        console.log(r);
        message.error("更改用户信息失败请重试");
      });
  };
  getUser = () => {
    axios
      .post(api.findUser, { id: localStorage.getItem("id") })
      .then((r) => {
        if (r.data.data.retcode || r.data.data.code) {
          message.error("服务验证失败,请重试");
          this.props.history.push("/home");
        } else {
          const { f_account, f_nickname,f_party_id } = r.data.data.data || r.data.data;
          this.formRef.current.setFieldsValue({
            id : f_party_id,
            account: f_account,
            nickname: f_nickname
          })

        }
      })
      .catch((r) => {
        console.log(r);
        message.error("获取用户信息失败请重试");
        this.props.history.push("/home");
      });
  };

  componentDidMount() {
    this.getUser();
  }

  render() {
    return (
      <div>
        <div className="site-layout-content">
          <h2 className="colorWhite">用户信息:</h2>
          <Form
            onFinish={this.changeUserInfo}
            initialValues={{ ...this.state }}
            labelAlign="right"
            layout="vertical"
            style={{ width: "30%" }}
            ref={this.formRef}
          >
            <Form.Item name="id" label="party_id" rules={[{ required: true }]}>
              <Input readOnly={true} disabled />
            </Form.Item>
            <Form.Item
              name="account"
              label="用户名"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nickname"
              label="用户名称"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Comp;
