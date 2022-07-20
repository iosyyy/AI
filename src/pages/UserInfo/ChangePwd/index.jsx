import React, { Component } from "react";
import PubSubJS from "pubsub-js";
import { Button, Form, Image, Input, message } from "antd";
import axios from "axios";
import api from "../../../config/api";

class Comp extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "57" });
  }
  changePassword = (values) => {
    axios
      .post(api.updateUserPwd, { id: localStorage.getItem("id"), ...values })
      .then((r) => {
        console.log(r.data);
        if (r.data.code) {
          message.error("服务验证失败,请重试");
        } else {
          this.props.history.push('/home');
          localStorage.setItem('role', null);
          localStorage.setItem('username', null);
          localStorage.setItem('party_name', null);
          localStorage.setItem('party_id', null);
          localStorage.setItem('userLogin', null);
          localStorage.setItem('account', null);
          localStorage.setItem('nickname', null);
          localStorage.setItem('id', null);
          localStorage.setItem('LOGIN_FLAG', null);
          message.success("修改成功，请重新登录")
        }
      })
      .catch((r) => {
        console.log(r);
        message.error("修改密码失败请重试");
      });
  };
  render() {
    return (
      <div>
        <div className="site-layout-content">
          <h2 className="colorWhite">修改登陆密码:</h2>
          <Form
            onFinish={this.changePassword}
            labelAlign="right"
            layout="vertical"
            style={{ width: "30%" }}
          >
            <Form.Item
              name="old_pwd"
              label="旧密码"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="new_pwd"
              label="新密码"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="newPwdAgain"
              label="再次确认新密码"
              rules={[
                { message: "请确认你的密码", required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_pwd") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不同"));
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
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
