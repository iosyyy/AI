import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Radio,
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

class DataSourceUpload extends Component {
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
      description: [],
      work_mode: [],
    };
  }

  onFormFinish = (ew) => {
    const {
      description,
      uploadKey,
      isLoading,
      namespaces,
      tables,
      disables,
      work_mode,
    } = this.state;
    const e = ew.users[uploadKey];
    const dis = disables.map((v, i) => {
      return false;
    });
    isLoading[uploadKey] = false;
    const formData = new FormData();
    if (!e.dataset.file) {
      message.error("数据填写错误,请重新填写");
      this.setState({
        isLoading,
        disables: dis,
        uploadIng: false,
      });
      return;
    }
    formData.append("file", e.dataset.file);
    formData.append("table_name", tables[uploadKey]);
    formData.append("namespace", namespaces[uploadKey]);
    formData.append("data_type", "0");
    formData.append("description", description[uploadKey]);
    formData.append("work_mode", work_mode[uploadKey]);

    let isNull = false;
    formData.forEach((v, k) => {
      if (!v) {
        isNull = true;
        message.error("数据填写错误,请重新填写");
        this.setState({
          isLoading,
          disables: dis,
          uploadIng: false,
        });
      }
    });
    if (isNull) {
      return;
    }
    axios
      .post(api.taskUpload, formData)
      .then((r) => {
        if (r.data.code === 0 || r.data.retcode === 0) {
          message.success("上传成功");
          this.setState({
            isLoading,
            disables: dis,
            uploadIng: false,
          });
        } else {
          message.error(r.data.retcode + ":" + r.data.retmsg).then((r) => {
            console.log(r);
          });
          this.setState({
            isLoading,
            disables: dis,
            uploadIng: false,
          });
        }
      })
      .catch((e) => {
        message.error("服务器链接异常");
        this.setState({
          isLoading,
          disables: dis,
          uploadIng: false,
        });
      });
  };

  render() {
    const tailLayout = {};
    const layout = {};
    const { uploadIng } = this.state;
    return (
      <div style={{ height: "80vh", padding: 0 }}>
        <Row
          justify={"center"}
          className={"scrollContent"}
          style={{ height: "75vh" }}
        >
          <Col>
            <Form size={"middle"} onFinish={this.onFormFinish} {...layout}>
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
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              style={{ marginTop: "1vh" }}
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
                                <Button>选择数据集文件</Button>
                              </Upload>
                            </Form.Item>
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              name={[name, "table_name"]}
                              fieldKey={[fieldKey, "table_name"]}
                              label={"数据表名"}
                            >
                              <Input
                                value={this.state.tables}
                                onChange={(e) => {
                                  const { tables } = this.state;
                                  tables[key] = e.target.value;
                                  this.setState({
                                    tables,
                                  });
                                }}
                                onPressEnter={(e) => {
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
                                onChange={(e) => {
                                  const { namespaces } = this.state;
                                  namespaces[key] = e.target.value;
                                  this.setState({
                                    namespaces,
                                  });
                                }}
                                onPressEnter={(e) => {
                                  e.preventDefault();
                                }}
                                placeholder={"请输入命名空间"}
                              />
                            </Form.Item>
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              name={[name, "description"]}
                              fieldKey={[fieldKey, "description"]}
                              label={"数据集描述"}
                            >
                              <Input
                                onChange={(e) => {
                                  const { description } = this.state;
                                  description[key] = e.target.value;
                                  this.setState({
                                    description,
                                  });
                                }}
                                onPressEnter={(e) => {
                                  e.preventDefault();
                                }}
                                placeholder={"请输入数据集描述"}
                              />
                            </Form.Item>
                            <Form.Item
                              style={{ marginTop: "1vh" }}
                              name={[name, "work_mode"]}
                              fieldKey={[fieldKey, "work_mode"]}
                              label={"数据集描述"}
                            >
                              <Radio.Group
                                onChange={(e) => {
                                  const { work_mode } = this.state;
                                  work_mode[key] = e.target.value;
                                  this.setState({
                                    work_mode,
                                  });
                                }}
                              >
                                <Radio value={0}>单机</Radio>
                                <Radio value={1}>集群</Radio>
                              </Radio.Group>
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
                          添加新的数据集
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataSourceUpload;
