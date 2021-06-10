import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Row,
  Space,
  Steps,
  Upload,
} from "antd";
import axios from "axios";
import api from "../../../config/api";
import FileImg from "../../../img/file.png";
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
      hello: "hello it is an result",
      fileList: [[], []],
      uploadKey: 0,
      isLoading: [false],
      namespaces: [],
      tables: [],
      disables: [],
      uploadIng: false,
    };
  }

  onFormFinish = ew => {
    const { uploadKey, isLoading, namespaces, tables, disables } = this.state;
    const e = ew.users[uploadKey];
    const dis = disables.map((v, i) => {
      return false;
    });
    isLoading[uploadKey] = false;
    const formData = new FormData();
    if (tables[uploadKey] && e.dataset && tables[uploadKey]) {
      formData.append("file", e.dataset.file);
      formData.append("table_name", namespaces[uploadKey]);
      formData.append("namespace", tables[uploadKey]);
    } else {
      message.error("数据填写错误,请重新填写");
      this.setState({
        isLoading,
        disables: dis,
        uploadIng: false,
      });
      return;
    }
    axios
      .post(api.taskUpload, formData)
      .then(r => {
        if (r.data.code === 0 || r.data.retcode === 0) {
          message.success("上传成功");
          this.setState({
            isLoading,
            disables: dis,
            uploadIng: false,
          });
        } else {
          message.error(r.data.retcode + ":" + r.data.retmsg).then(r => {
            console.log(r);
          });
          this.setState({
            isLoading,
            disables: dis,
            uploadIng: false,
          });
        }
      })
      .catch(e => {
        message.error("服务器链接异常");
        this.setState({
          isLoading,
          disables: dis,
          uploadIng: false,
        });
      });
  };

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
              title: "数据上传",
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
            <Form size={"middle"} onFinish={this.onFormFinish} {...layout}>
              <Form.List rules={[{ required: true }]} name="users">
                {(fields, { add, remove }) =>
                  <div>
                    {fields.map(({ key, name, fieldKey, ...restField }) =>
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          style={{ width: "18vw", marginTop: "1vh" }}
                          name={[name, "dataset"]}
                          fieldKey={[fieldKey, "dataset"]}
                          label="数据集选择"
                        >
                          <Upload
                            maxCount={1}
                            beforeUpload={() => {
                              return false;
                            }}
                            iconRender={() => {
                              return (
                                <Image
                                  preview={false}
                                  style={{ width: "13px" }}
                                  src={FileImg}
                                />
                              );
                            }}
                          >
                            <Button>选择文件</Button>
                          </Upload>
                        </Form.Item>
                        <Form.Item
                          style={{ marginTop: "1vh" }}
                          name={[name, "table_name"]}
                          fieldKey={[fieldKey, "table_name"]}
                          label={"表名"}
                        >
                          <Input
                            value={this.state.tables}
                            onChange={e => {
                              const { tables } = this.state;
                              tables[key] = e.target.value;
                              this.setState({
                                tables,
                              });
                            }}
                            onPressEnter={e => {
                              e.preventDefault();
                            }}
                            placeholder={"请输入表名"}
                          />
                        </Form.Item>
                        <Form.Item
                          style={{ marginTop: "1vh" }}
                          name={[name, "namespace"]}
                          fieldKey={[fieldKey, "namespace"]}
                          label={"命名空间"}
                        >
                          <Input
                            value={this.state.namespaces}
                            onChange={e => {
                              const { namespaces } = this.state;
                              namespaces[key] = e.target.value;
                              this.setState({
                                namespaces,
                              });
                            }}
                            onPressEnter={e => {
                              e.preventDefault();
                            }}
                            placeholder={"请输入命名空间"}
                          />
                        </Form.Item>
                        <Form.Item style={{ marginTop: "1vh" }} {...tailLayout}>
                          <Button
                            disabled={this.state.disables[key]}
                            onClick={e => {
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
                    )}
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
                        添加新的数据集
                      </Button>
                    </Form.Item>
                  </div>}
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
