import React, { Component } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";

class Interface extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "9" });
    this.state = {
      loading: false,
      paramType: 0,
      feature_data: "",
      feature_id: "",
    };
  }

  render() {
    const { loading, feature_data, feature_id } = this.state;
    const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };

    return (
      <div>
        <Form
          style={{ marginTop: "2vh" }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={(e) => {
            axios
              .post(api.single, {
                feature_data: JSON.parse(e.feature_data),
                feature_id: JSON.parse(e.feature_id),
                service_id: e.service_id,
              })
              .then((r) => {
                const { code, msg, data } = r.data;
                if (code === 0) {
                  message.info("score:" + data.score);
                } else {
                  message.error(msg);
                }
              });
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
                name="feature_id"
                label={<div style={fontStyle}>匹配样本的特征值</div>}
                rules={[
                  { required: true, message: "请输入特征值" },
                  {
                    validator: (_, value) => {
                      if (!value || value.trim() === "") {
                        return Promise.resolve();
                      }
                      let jsonVal = "{" + value + "}";
                      try {
                        JSON.parse(jsonVal);
                      } catch {
                        try {
                          JSON.parse(value);
                        } catch {
                          return Promise.reject(
                            new Error("特征值不符合格式要求")
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <div>
                  <TextArea
                    value={feature_id}
                    onChange={(e) => {
                      const { value } = e.target;
                      let jsonVal = "{" + value + "}";
                      let data = {};
                      try {
                        data = JSON.parse(jsonVal);
                      } catch {
                        try {
                          data = JSON.parse(value);
                        } catch {
                          this.setState({ feature_id: value });
                          return;
                        }
                      }
                      console.log(feature_id);
                      this.setState({
                        feature_id: JSON.stringify(data, null, "  "),
                      });
                    }}
                    autoSize={true}
                    placeholder={"请输入特征值"}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[0, 30]} justify={"center"}>
            <Col span={8}>
              <Form.Item
                value={feature_data}
                name="feature_data"
                label={<div style={fontStyle}>样本内容</div>}
                rules={[
                  { required: true, message: "请输入样本内容" },
                  {
                    validator: (_, value) => {
                      if (!value || value.trim() === "") {
                        return Promise.resolve();
                      }
                      let jsonVal = "{" + value + "}";
                      try {
                        JSON.parse(jsonVal);
                      } catch {
                        try {
                          JSON.parse(value);
                        } catch {
                          return Promise.reject(
                            new Error("样本内容不符合格式要求")
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <div>
                  <TextArea
                    autoSize={true}
                    value={feature_data}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                      }
                      console.log(e);
                    }}
                    onChange={(e) => {
                      const { value } = e.target;
                      let jsonVal = "{" + value + "}";
                      let data = {};
                      try {
                        data = JSON.parse(jsonVal);
                      } catch {
                        try {
                          data = JSON.parse(value);
                        } catch {
                          this.setState({ feature_data: value });
                          return;
                        }
                      }
                      console.log(feature_data);
                      this.setState({
                        feature_data: JSON.stringify(data, null, "  "),
                      });
                    }}
                    placeholder={"请输入样本内容"}
                  />
                </div>
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
