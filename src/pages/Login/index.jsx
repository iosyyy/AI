import React, { Component } from "react";
import { Button, Checkbox, Col, Form, Image, Input, message, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../config/api";

import star from "../../img/star.png";
import logo from "../../img/logolast.png";

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
            localStorage.setItem("username", "H");
          } else {
            localStorage.setItem("role", "guest");
            localStorage.setItem("username", "G");
          }
          console.log(localStorage.getItem("role"));

          localStorage.setItem("party_name", party_name);
          localStorage.setItem("party_id", party_id);
        }
      })
      .catch((r) => {
        message.error("链接服务器失败请重试");
        localStorage.setItem("role", null);
      })
      .finally(() => {
        localStorage.setItem("userLogin", "success");
        this.props.history.push("/federalTrain");
      });
  };

  render() {
    return (
      <div className="pageheader">
        <Row style={{ height: "100vh" }} align={"middle"} justify={"center"}>
          <Col className={"site-layout-content-login"}>
            <div
              style={{
                width: "320px",
                height: "100%",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                userSelect: "none",
              }}
              className="logo"
            >
              <Image width={"40px"} preview={false} src={star} />
              <span style={{ color: "black", fontSize: "130%" }}>
                金融数据多方安全共享平台
              </span>
            </div>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={this.login}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your Username!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
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
                &nbsp; Or <a href=""> register now!</a>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
