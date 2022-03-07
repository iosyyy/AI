import React, { Component } from "react";
import { Button, Col, Form, Input, message, Row, Space, Steps } from "antd";
import "antd/dist/antd.css";
import { withRouter } from "react-router-dom";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";
import { fontStyle } from "../../../util/util";
import PubSubJS from "pubsub-js";
import axios from "axios";
import api from "../../../config/api";

const { Step } = Steps;

class JointStatementCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [[], []],
      uploadKey: 0,
      isLoading: [false],
      disables: [],
      uploadIng: false,
      table_name: ["", ""],
      party_id: ["", ""],
      role: ["guest", "host"],
      job_name: "",
      job_description: "",
    };
  }

  ableToUp = () => {
    const { party_id, table_name, job_name, job_description } = this.state;

    for (const party of party_id) {
      if (isNaN(party)) {
        return false;
      }
    }

    for (const party of table_name) {
      if (!party) {
        return false;
      }
    }
    if (!job_name || !job_description) {
      message.error("任务名称与任务简绍都不能为空");
      return false;
    }
    return true;
  };

  getData = () => {
    const { party_id, table_name, job_name, job_description } = this.state;
    const data = {};
    data.guest = {
      party_id: parseInt(party_id[0]),
      table_name: table_name[0],
    };
    data.host = party_id.slice(1).map((v, i) => {
      return {
        party_id: parseInt(party_id[i + 1]),
        table_name: table_name[i + 1],
      };
    });
    data.job_name = job_name;
    data.job_description = job_description;
    data.work_mode = 0;
    return data;
  };

  componentDidMount() {
    PubSubJS.publish("isRunning", { page: "22" });
  }

  render() {
    const tailLayout = {
      wrapperCol: { span: 5 },
    };
    const layout = {};
    const { uploadIng, job_name, job_description } = this.state;
    return (
      <div style={{ height: "83vh" }} className="site-layout-content">
        <Row justify={"center"} className={"scrollContent"}>
          <Col>
            <Form
              size={"middle"}
              onFinish={(e) => {
                console.log(this.getData(e));
              }}
              {...layout}
            >
              <Form.Item
                style={{ marginTop: "1vh" }}
                name={"job_name"}
                {...tailLayout}
                label={<div style={fontStyle}>任务名称</div>}
              >
                <Input
                  value={job_name}
                  onChange={(e) => {
                    this.setState({
                      job_name: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                {...tailLayout}
                style={{ marginTop: "1vh" }}
                name={"job_description"}
                label={<div style={fontStyle}>任务描述</div>}
              >
                <Input
                  value={job_description}
                  onChange={(e) => {
                    this.setState({
                      job_description: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.List rules={[{ required: true }]} name="partys">
                {(fields, { add, remove }) => {
                  if (fields.length === 0) {
                    add();
                    fields.push({
                      fieldKey: 0,
                      isListField: true,
                      key: 0,
                      name: 0,
                    });
                    add();
                    fields.push({
                      fieldKey: 1,
                      isListField: true,
                      key: 1,
                      name: 1,
                    });
                  }
                  return (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => {
                        return (
                          <Space
                            size={15}
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              name={[name, "role"]}
                              label={<div style={fontStyle}>角色类型</div>}
                              fieldKey={[fieldKey, "role"]}
                            >
                              <div>
                                <Input
                                  value={key === 0 ? "主导方" : "参与方"}
                                />
                              </div>
                            </Form.Item>
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              name={[name, "party_id"]}
                              fieldKey={[fieldKey, "party_id"]}
                              label={<div style={fontStyle}>成员ID</div>}
                              onChange={(e) => {
                                const { party_id } = this.state;
                                party_id[key] = e.target.value;
                                this.setState({
                                  party_id,
                                });
                              }}
                              rules={[
                                {
                                  required: true,
                                  validator: (_, value) => {
                                    if (
                                      (isNaN(value) && value) ||
                                      value % 1 !== 0
                                    ) {
                                      return Promise.reject(
                                        new Error("请输入一个整数作为成员的ID")
                                      );
                                    }
                                  },
                                },
                              ]}
                            >
                              <Input placeholder={"输入成员ID(必须为整数)"} />
                            </Form.Item>
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              name={[name, "table_name"]}
                              fieldKey={[fieldKey, "table_name"]}
                              label={<div style={fontStyle}>数据表名称</div>}
                              onChange={(e) => {
                                const { table_name } = this.state;
                                table_name[key] = e.target.value;
                                this.setState({
                                  table_name,
                                });
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: "数据表名称不能为空",
                                },
                              ]}
                            >
                              <Input placeholder={"请输入数据表名称"} />
                            </Form.Item>
                            {key >= 2 ? (
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            ) : (
                              <></>
                            )}
                          </Space>
                        );
                      })}
                      <Form.Item>
                        <Button
                          type="dashed"
                          disabled={this.state.uploadIng}
                          onClick={() => {
                            add();
                            const {
                              isLoading,
                              disables,
                              uploadIng,
                              role,
                              party_id,
                              table_name,
                            } = this.state;
                            isLoading.push(false);
                            disables.push(false);
                            party_id.push("");
                            table_name.push("");
                            role.push("host");
                            this.setState({
                              isLoading,
                              disables,
                              role,
                            });
                          }}
                          block
                          icon={<PlusOutlined />}
                        >
                          新增参与方
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
              <Row justify={"center"}>
                <Col>
                  <Form.Item name={"submit"}>
                    <Button
                      loading={uploadIng}
                      onClick={() => {
                        if (this.ableToUp()) {
                          this.setState({
                            uploadIng: true,
                          });
                          axios
                            .post(api.submitJob, { ...this.getData() })
                            .then((r) => {
                              if (r.data.code === 0) {
                                message.success("执行任务成功");
                                this.props.history.push("/training");
                              } else {
                                message.error("执行失败请重试");
                              }
                            })
                            .catch((r) => {
                              message.error("服务器异常");
                            })
                            .finally(() => {
                              this.setState({
                                uploadIng: false,
                              });
                            });
                        }
                      }}
                      type="primary"
                      htmlType="submit"
                    >
                      执行任务
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(JointStatementCreate);
