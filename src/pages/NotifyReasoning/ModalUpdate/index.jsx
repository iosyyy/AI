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
} from "antd";
import axios from "axios";
import api from "../../../config/api";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { fontStyle } from "../../../util/util";

class ModalUpdate extends Component {
  render() {
    const {
      show,
      selectId,
      loading,
      history,
      setLoadingAndShow,
      setShow,
    } = this.props;

    return (
      <Modal
        title="数据上传"
        visible={show}
        onCancel={() => {
          setShow(false);
        }}
        style={{ top: 40 }}
        width={"45vw"}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          initialValues={{ ...selectId }}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 24 }}
          onFinish={(e) => {
            const { service_id, context, file } = e;
            const formData = new FormData();
            formData.append("file", file.file);
            formData.append("context", context);
            formData.append("service_id", service_id);
            setLoadingAndShow(true, true);
            axios
              .post(api.uploadFile, formData)
              .then((r) => {
                const { code, msg, data } = r.data;
                if (code !== 0) {
                  message.error("上传失败:" + data?.retmsg ?? "");
                  return;
                }
                message.success("上传成功");
                history.push("/reasoning/modelTable");
                location.reload();
              })
              .finally(() => {
                setLoadingAndShow(false, false);
              });
          }}
          layout={"vertical"}
        >
          <Row justify={"center"}>
            <Col span={24}>
              <Form.Item
                name="service_id"
                label={<div style={fontStyle}>service_id</div>}
                rules={[{ required: true, message: "请输入service_id" }]}
              >
                <Input disabled placeholder={"请输入service_id"} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Col span={24}>
              <Form.Item
                name="file"
                label={<div style={fontStyle}>预测样本</div>}
                rules={[{ required: true, message: "请上传预测样本后重试" }]}
              >
                <Upload
                  beforeUpload={() => {
                    return false;
                  }}
                  style={{ width: "10px" }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>
                    上传预测样本 (Max: 1)
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Col span={24}>
              <Form.Item
                name="context"
                label={<div style={fontStyle}>数据信息</div>}
                rules={[{ required: true, message: "请输入数据信息" }]}
              >
                <TextArea
                  autoSize={{ minRows: 6, maxRows: 6 }}
                  placeholder={"请输入数据信息"}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify={"end"}>
            <Space>
              <Col>
                <Form.Item>
                  <Button
                    onClick={() => {
                      setLoadingAndShow(false, false);
                    }}
                  >
                    取消
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    上传
                  </Button>
                </Form.Item>
              </Col>
            </Space>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default ModalUpdate;
