import React, { Component } from "react";
import { Button, Col, Form, Image, Input, message, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../config/api";

import star from "../../img/star.png";

class Login extends Component {
  setF = () => {
    // 过期时间为三天
    const duration = 1000 * 3 * 60 * 60 * 24;
    localStorage.setItem("LOGIN_FLAG", String(new Date().getTime() + duration));
  };
  loginPublish = (values) => {
    console.log(values);
    axios
      .post(api.userLogin, { ...values })
      .then((r) => {
        if (r.data.data.retcode || r.data.data.code) {
          message.error("服务验证失败,请重试");
        } else {
          const { account, nickname, id } = r.data.data.data || r.data.data;
          localStorage.setItem("account", account);
          localStorage.setItem("nickname", nickname);
          localStorage.setItem("id", id);
          console.log(id);
          axios
            .get(api.getClientInfo)
            .then((r) => {
              if (r.data.data.retcode || r.data.data.code) {
                message.error("服务验证失败,请重试");
              } else {
                const { party_name, party_id } =
                  r.data.data.data || r.data.data;
                const indexOf = party_name.indexOf("guest");
                if (indexOf === -1) {
                  localStorage.setItem("role", "host");
                  localStorage.setItem("username", "H");
                } else {
                  localStorage.setItem("role", "guest");
                  localStorage.setItem("username", "G");
                }

                localStorage.setItem("party_name", party_name);
                localStorage.setItem("party_id", party_id);
                localStorage.setItem("userLogin", "success");
                this.setF();

                this.props.history.push("/federalTrain");
              }
            })
            .catch((r) => {
              message.error("链接服务器失败请重试");
              localStorage.setItem("role", null);
              localStorage.setItem("username", null);
              localStorage.setItem("party_name", null);
              localStorage.setItem("party_id", null);
              localStorage.setItem("userLogin", null);
            });
        }
      })
      .catch((r) => {
        console.log(r);
        message.error("登录失败请重试");
        localStorage.setItem("account", null);
        localStorage.setItem("nickname", null);
        localStorage.setItem("id", null);
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
              onFinish={this.loginPublish}
            >
              <Form.Item
                name="account"
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
                name="pwd"
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

              <Row justify="center">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
