import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Upload,
  Radio,
  Select,
} from "antd";
import axios from "axios";
import api from "../../../config/api";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { fontStyle } from "../../../util/util";

const { Option } = Select;

class ModalGet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: true,
      feature_id: "",
      feature_data: "",
      file_path: "",
      serviceIdList: [],
    };
  }

  getServiceIdList = () => {
    axios
      .get(api.findDeployListStatus1)
      .then((r) => {
        const { data, code, msg } = r.data;
        if (code !== 0) {
          message.error(msg);
          return;
        }
        console.log(r);

        const serviceIdList = data.data.map((v, i) => {
          return v.f_service_id;
        });
        this.setState({
          serviceIdList,
        });
      })
      .catch((r) => {
        message.error("服务器异常");
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.getServiceIdList();
  }

  submitInterface(e) {
    const { setLoadingAndShow, history } = this.props;
    const { feature_data, feature_id } = this.state;

    setLoadingAndShow(true, true);

    axios
      .post(api.single, {
        feature_data: JSON.parse(feature_data),
        feature_id: JSON.parse(feature_id),
        service_id: e.service_id,
      })
      .then((r) => {
        const { code, msg, data } = r.data;
        if (code === 0) {
          message.info("score:" + data?.data?.score ?? "");
        } else {
          message.error(msg);
        }
      })
      .catch((r) => {
        message.error("上传错误请重试");
      })
      .finally(() => {
        setLoadingAndShow(false, false);
        this.exit();
      });
  }
  submitBatchInterface(e) {
    const { service_id, file, name, context } = e;
    const formData = new FormData();
    formData.append("service_id", service_id);
    formData.append("file", file.file);
    formData.append("name", name);
    formData.append("context", context);
    const { setLoadingAndShow, history } = this.props;
    setLoadingAndShow(true, true);
    axios
      .post(api.batchSingle, formData)
      .then((r) => {
        const { code, msg } = r.data;
        if (code === 0) {
          message.success("批量预测完成");
          // this.setState({
          //   file_path: data.file_path,
          // });
          history.push("/reasoning/batch_interface");
          location.reload();
        } else {
          message.error(msg);
        }
      })
      .catch((e) => {
        message.error("批量处理失败");
      })
      .finally(() => {
        setLoadingAndShow(false, false);
        this.exit();
      });
  }

  exit = () => {
    this.setState({
      select: true,
      feature_id: "",
      feature_data: "",
      file_path: "",
    });
  };

  render() {
    const { show, selectId, loading, history, setShow, file_path } = this.props;
    const { feature_id, feature_data, select, serviceIdList } = this.state;
    return (
      <Modal
        title="在线推理"
        visible={show}
        onCancel={() => {
          setShow(false);
          this.exit();
        }}
        style={{ top: 40 }}
        width={"45vw"}
        footer={null}
        destroyOnClose={true}
      >
        <Radio.Group
          onChange={(e) => {
            this.setState({
              select: e.target.value,
            });
          }}
          style={{ marginBottom: "5px" }}
          defaultValue={select}
          buttonStyle="solid"
        >
          <Radio.Button value={true}>单例预测</Radio.Button>
          <Radio.Button value={false}>批量预测</Radio.Button>
        </Radio.Group>
        <Form
          initialValues={{ ...selectId }}
          onFinish={(e) => {
            if (select) {
              this.submitInterface(e);
            } else {
              this.submitBatchInterface(e);
            }
          }}
          layout={"vertical"}
        >
          {select ? (
            <>
              <Row>
                <Col span={14}>
                  <Form.Item
                    name="service_id"
                    label={<div style={fontStyle}>service_id</div>}
                    rules={[{ required: true, message: "请输入service_id" }]}
                  >
                    <Select disabled={true}>
                      {serviceIdList.map((v, i) => {
                        return (
                          <Option key={`serviceId${i}`} value={v}>
                            {v}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={14}>
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
              <Row gutter={[0, 30]}>
                <Col span={14}>
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
              <Row>
                <Col>
                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      执行
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row justify={"center"}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label={<div style={fontStyle}>任务名称</div>}
                    rules={[{ required: true, message: "请输入任务名称" }]}
                  >
                    <Input placeholder={"请输入任务名称"} />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"center"}>
                <Col span={24}>
                  <Form.Item
                    name="context"
                    label={<div style={fontStyle}>任务简介</div>}
                    rules={[{ required: true, message: "请输入任务简介" }]}
                  >
                    <Input placeholder={"请输入任务简介"} />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"center"}>
                <Col span={24}>
                  <Form.Item
                    name="service_id"
                    label={<div style={fontStyle}>service_id</div>}
                    rules={[{ required: true, message: "请输入service_id" }]}
                  >
                    <Select disabled={true}>
                      {serviceIdList.map((v, i) => {
                        return (
                          <Option key={`serviceId${i}`} value={v}>
                            {v}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {/*<Row justify={"center"}>
              <Col span={14}>
                <Form.Item
                  name="feature"
                  label={<div style={fontStyle}>匹配样本的特征</div>}
                  rules={[{ required: true, message: "请输入特征" }]}
                >
                  <Input placeholder={"请输入特征"} />
                </Form.Item>
              </Col>
            </Row>*/}
              <Row gutter={[0, 30]} justify={"center"}>
                <Col span={24}>
                  <Form.Item
                    name="file"
                    label={<div style={fontStyle}>预测样本</div>}
                    rules={[
                      { required: true, message: "请上传预测样本后重试" },
                    ]}
                  >
                    <Upload
                      beforeUpload={() => {
                        return false;
                      }}
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>
                        上传预测样本 (Max: 1)
                      </Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label={<div style={fontStyle}>下载预测样本模板</div>}
                  >
                    <Button
                      onClick={() => {
                        const href =
                          window.location.protocol +
                          "//" +
                          window.location.hostname +
                          ":9380" +
                          file_path;
                        FileSaver.saveAs(href);
                      }}
                      disabled={file_path == null}
                      icon={<DownloadOutlined />}
                    >
                      下载模板
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify={"center"}>
                <Col>
                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      提交
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Modal>
    );
  }
}

export default ModalGet;
