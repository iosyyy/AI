import React, { Component } from "react";
import { Button, Col, Form, Input, Row, Space, Steps } from "antd";
import "antd/dist/antd.css";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";
import { fontStyle } from "../../../util/util";

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
    };
  }

  //
  // toNextPage = () => {
  //   const { party_id, role, table_name } = this.state;
  //   if (!this.ableToUp()) {
  //     return;
  //   }
  //   const data = {};
  //   data.guest = {
  //     party_id: parseInt(party_id[0]),
  //     table_name: table_name[0],
  //   };
  //   data.host = party_id.slice(1).map((v, i) => {
  //     return {
  //       party_id: parseInt(party_id[i + 1]),
  //       table_name: table_name[i + 1],
  //     };
  //   });
  //   this.props.history.push({
  //     pathname: "/federalTrain/choice",
  //     state: {
  //       data,
  //       selectValue: this.props.location.state.selectValue,
  //     },
  //   });
  // };

  toLastPage = () => {
    this.props.history.push({
      pathname: "/federalTrain/type",
    });
  };

  render() {
    const tailLayout = {
      wrapperCol: { span: 5 },
    };
    const layout = {};
    const { uploadIng } = this.state;
    return (
      <div style={{ height: "83vh" }} className="site-layout-content">
        <Row justify={"center"} className={"scrollContent"}>
          <Col>
            <Form
              size={"middle"}
              onFinish={() => {}}
              onFinishFailed={() => {
                this.setState({});
              }}
              {...layout}
            >
              <Form.Item
                style={{ marginTop: "1vh" }}
                name={"name"}
                {...tailLayout}
                label={<div style={fontStyle}>任务名称</div>}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...tailLayout}
                style={{ marginTop: "1vh" }}
                name={"describe"}
                label={<div style={fontStyle}>任务描述</div>}
              >
                <Input />
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
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
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

export default JointStatementCreate;
