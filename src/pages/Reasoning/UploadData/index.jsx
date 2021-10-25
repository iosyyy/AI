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
  Table,
  Upload,
} from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";
import TextArea from "antd/es/input/TextArea";
const COLUMNS = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "service_id",
    dataIndex: "service_id",
    key: "service_id",
  },
  {
    title: "数据信息",
    dataIndex: "note",
    key: "note",
  },
  {
    title: "上传时间",
    dataIndex: "upload_time",
    key: "upload_time",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    render: () => {
      return (
        <Space>
          <Button type={"primary"}>下载</Button>
          <Button danger type={"primary"}>
            删除
          </Button>
        </Space>
      );
    },
  },
];
class UploadData extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "11" });

    this.state = {
      show: false,
      loading: false,
      datasource: [
        {
          index: 0,
          service_id: "203541102419413968753497",
          note: "upload success",
          upload_time: new Date("2021-10-01"),
          status: "完成",
          key: 0,
        },
        {
          index: 1,
          service_id: "2331102419413968753182",
          note: "upload success",
          upload_time: new Date("2021-10-15"),
          status: "完成",
          key: 1,
        },
        {
          index: 2,
          service_id: "2251101424941396875431",
          note: "upload success",
          upload_time: new Date("2021-10-08"),
          status: "完成",
          key: 2,
        },
        {
          index: 3,
          service_id: "20211532234139687534",
          note: "upload failed",
          upload_time: new Date("2021-10-11"),
          status: "失败",
          key: 3,
        },
        {
          index: 4,
          service_id: "202121413968753497",
          note: "upload success",
          upload_time: new Date("2021-10-09"),
          status: "完成",
          key: 4,
        },
      ],
    };
  }

  render() {
    const { show, loading, datasource } = this.state;
    const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };

    return (
      <div>
        <Button
          onClick={() => {
            this.setState({
              show: true,
            });
          }}
        >
          上传
        </Button>
        <Table
          size={"middle"}
          style={{ marginTop: "1vh" }}
          dataSource={datasource}
          columns={COLUMNS}
          bordered
        />
        <Modal
          title="数据上传"
          visible={show}
          onCancel={() => {
            this.setState({
              show: false,
            });
          }}
          width={"33vw"}
          footer={null}
          destroyOnClose
        >
          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 24 }}
            onFinish={(e) => {
              console.log(e);
              const { datasource } = this.state;
              const data = [...datasource];
              data.push({
                index: data.length + 1,
                service_id: e.service_id,
                note: e.note,
                upload_time: new Date(),
                status: "完成",
                key: data.length + 1,
              });
              message.success("上传成功");
              this.setState({
                datasource: data,
                show: false,
              });
            }}
            layout={"horizontal"}
          >
            <Row justify={"center"}>
              <Col span={24}>
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
              <Col span={24}>
                <Form.Item
                  name="note"
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
                        this.setState({
                          show: false,
                        });
                      }}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      执行
                    </Button>
                  </Form.Item>
                </Col>
              </Space>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default UploadData;
