import React, { Component } from "react";
import { Button, Col, Form, Input, Row, Space, Steps } from "antd";
import "antd/dist/antd.css";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";

const { Step } = Steps;

class FederalResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [[], []],
      uploadKey: 0,
      isLoading: [false],
      disables: [],
      uploadIng: false,
      tableCode: [],
      userID: [],
    };
  }

  onFormFinish = (ew) => {};

  toNextPage = () => {
    this.props.history.push({
      pathname: "/federalTrain/choice",
    });
  };

  toLastPage = () => {
    this.props.history.push({
      pathname: "/federalTrain/form",
    });
  };

  render() {
    const tailLayout = {};
    const layout = {};
    const { uploadIng } = this.state;
    return (
      <div style={{ height: "80vh" }} className="site-layout-content">
        <StepsTemplate
          steps={[
            { status: "finish", title: "联邦类型", icon: <FileOutlined /> },
            {
              status: "process",
              title: "数据集选择",
              icon: uploadIng ? <LoadingOutlined /> : <CloudUploadOutlined />,
            },
            {
              status: "wait",
              title: "参数配置",
              icon: <DownloadOutlined />,
            },
          ]}
        />
        <Row
          justify={"center"}
          className={"scrollContent"}
          style={{ height: "60vh" }}
        >
          <Col>
            {/*TODO 目前处于测试阶段固禁用此表单*/}
            <Form
              disabled
              size={"middle"}
              onFinish={this.onFormFinish}
              {...layout}
            >
              <Form.List rules={[{ required: true }]} name="users">
                {(fields, { add, remove }) => {
                  if (fields.length === 0) {
                    add();
                    fields.push({
                      fieldKey: 0,
                      isListField: true,
                      key: 0,
                      name: 0,
                    });
                  }
                  return (
                    <div>
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
                              name={[name, "table_name"]}
                              fieldKey={[fieldKey, "table_name"]}
                              label={"成员ID"}
                            >
                              <Input
                                value={this.state.tables}
                                onChange={(e) => {
                                  const { userID } = this.state;
                                  userID[key] = e.target.value;
                                  this.setState({
                                    userID,
                                  });
                                }}
                                onPressEnter={(e) => {
                                  e.preventDefault();
                                }}
                                placeholder={"请输入成员ID"}
                              />
                            </Form.Item>
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              name={[name, "namespace"]}
                              fieldKey={[fieldKey, "namespace"]}
                              label={"数据表代码"}
                            >
                              <Input
                                value={this.state.namespaces}
                                onChange={(e) => {
                                  const { tableCode } = this.state;
                                  tableCode[key] = e.target.value;
                                  this.setState({
                                    tableCode,
                                  });
                                }}
                                onPressEnter={(e) => {
                                  e.preventDefault();
                                }}
                                placeholder={"请输入数据表代码"}
                              />
                            </Form.Item>
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              {...tailLayout}
                            >
                              <Button
                                disabled={this.state.disables[key]}
                                onClick={(e) => {
                                  let { isLoading, disables } = this.state;
                                  isLoading[key] = true;
                                  disables[key] = true;
                                  disables = disables.map((v, k) => {
                                    return !v;
                                  });
                                  this.setState({
                                    uploadKey: key,
                                    isLoading,
                                    disables,
                                    uploadIng: true,
                                  });
                                }}
                                loading={this.state.isLoading[key]}
                                type="primary"
                                htmlType="submit"
                              >
                                上传
                              </Button>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        );
                      })}
                      <Form.Item>
                        <Button
                          type="dashed"
                          disabled={this.state.uploadIng}
                          onClick={() => {
                            add();
                            let { isLoading, disables, uploadIng } = this.state;
                            isLoading.push(false);
                            disables.push(false);
                            this.setState({
                              isLoading,
                              disables,
                            });
                          }}
                          block
                          icon={<PlusOutlined />}
                        >
                          添加新的数据集选择
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
            </Form>
          </Col>
        </Row>
        <Row style={{ marginTop: "30px" }} justify={"center"}>
          <Space size={300}>
            <Button
              onClick={this.toLastPage}
              style={{ background: "rgb(201,201,201)" }}
              size="large"
            >
              上一步
            </Button>
            <Button onClick={this.toNextPage} type="primary" size="large">
              下一步
            </Button>
          </Space>
        </Row>
      </div>
    );
  }
}

export default FederalResult;
