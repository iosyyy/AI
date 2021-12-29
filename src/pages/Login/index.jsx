import React, { Component } from "react";
import { Button, Checkbox, Form, Input, message, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../config/api";

class Login extends Component {
  login = (values) => {
    console.log("Received values of form: ", values);
    axios
      .get(api.getClientInfo)
      .then((r) => {
        if (r.data.data.retcode || r.data.data.code) {
          message.error("服务验证失败,请重试");
        } else {
          const { party_name, party_id } = r.data.data.data || r.data.data;
          const indexOf = party_name.indexOf("guest");
          if (indexOf === -1) {
            localStorage.setItem("role", "host");
          } else {
            localStorage.setItem("role", "guest");
          }
          console.log(localStorage.getItem("role"));

          localStorage.setItem("party_name", party_name);
          localStorage.setItem("userLogin", "success");
          localStorage.setItem("party_id", party_id);
          this.props.history.push("/federalTrain");
        }
      })
      .catch((r) => {
        message.error("链接服务器失败请重试");
        localStorage.setItem("role", null);
      });
  };

  render() {
    return (
      <Row className="site-layout-content" justify={"center"}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={this.login}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </Row>
    );
  }
}

export default Login;
