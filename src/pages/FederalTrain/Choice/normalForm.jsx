import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Space,
  Radio,
  Spin,
  Row,
  Col,
  Switch,
  Modal,
  Table,
} from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import api from "../../../config/api";
import { number } from "echarts";
import { fontStyle } from "../../../util/util";

const columns = [
  {
    title: <div>参数名</div>,
    dataIndex: "name",
    key: "name",
  },
  {
    title: <div>参数含义</div>,
    dataIndex: "mean",
    key: "mean",
  },
  {
    title: <div>默认值</div>,
    dataIndex: "defaultValue",
    key: "defaultValue",
  },
  {
    title: <div>可选值</div>,
    dataIndex: "checkValue",
    key: "checkValue",
  },
];

class NormalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      paramType: 0,
      modal: false,
      dataSource: [],
    };
  }
  render() {
    const { modal, dataSource } = this.state;
    console.log(this.props);
    // 表单样式
    const tailLayout = {
      wrapperCol: { offset: 9 },
    };
    // 表单样式
    const layout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 8 },
    };
    return (
      <div style={{ overflow: "auto" }}>
        <Spin spinning={this.state.loading} size="large">
          <Form
            name="normalConfig"
            size={"middle"}
            onFinish={(e) => {
              const { paramType } = this.state;
              this.setState({
                loading: true,
              });

              let guest = this.props.guest;
              let host = this.props.host;
              let algorithmParms;
              if (paramType === 0) {
                algorithmParms = e.algorithmParms
                  ? JSON.parse("{" + e.algorithmParms + "}")
                  : {};
              } else {
                algorithmParms = e.algorithmParms
                  ? JSON.parse(e.algorithmParms)
                  : {};
              }

              let percent = parseFloat(e.percent);
              let jobDescription = e.postScript ? e.postScript : "";

              axios({
                url: api.beginNormalTrain,
                method: "post",
                data: {
                  guest: guest,
                  host: host,
                  job_name: e.trainName,
                  job_description: jobDescription,
                  work_mode: e.trainType,
                  config_type: 0,
                  train_algorithm_name: e.algorithm,
                  algorithm_parameters: algorithmParms,
                  isScale: e.isScale ?? true,
                  test_size: percent,
                },
              }).then(
                (data) => {
                  if (data.data.retcode === 0 || data.data.code === 0) {
                    message.success("上传成功");
                    this.props.history.push({
                      pathname: "/training",
                      state: { data: data.data },
                    });
                  } else {
                    message.success("上传失败1");
                    this.setState({
                      loading: false,
                    });
                  }
                },
                () => {
                  message.success("上传失败2");
                  this.setState({
                    loading: false,
                  });
                }
              );
            }}
            {...layout}
            onFinishFailed={(e) => {
              console.log(e);
            }}
          >
            <Form.Item
              name="trainName"
              label={<div style={fontStyle}>任务名称</div>}
              rules={[
                { required: true, whitespace: true, message: "请输入任务名称" },
              ]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>

            <Form.Item
              name="trainType"
              label={<div style={fontStyle}>任务类型</div>}
              rules={[{ required: true, message: "请选择任务类型" }]}
            >
              <Radio.Group>
                <Radio value={0}>单机</Radio>
                <Radio value={1}>多机</Radio>
              </Radio.Group>
            </Form.Item>

            {/* 采用算法是上个页面传过来的,目前写死为 homo_logistic_regression */}
            <Form.Item
              name="algorithm"
              label={<div style={fontStyle}>采用算法</div>}
              initialValue={this.props.selectValue}
              rules={[
                { required: true, whitespace: true, message: "请输入采用算法" },
              ]}
            >
              <Input placeholder="请输入采用算法" disabled />
            </Form.Item>

            <Form.Item
              style={{ margin: 0, padding: 0 }}
              name="algorithmParms"
              label={<div style={fontStyle}>算法参数</div>}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || value.trim() === "") {
                      return Promise.resolve();
                    }
                    let jsonVal = "{" + value + "}";
                    try {
                      JSON.parse(jsonVal);
                      this.setState({ paramType: 0 });
                    } catch {
                      try {
                        JSON.parse(value);
                        this.setState({ paramType: 1 });
                      } catch {
                        return Promise.reject(
                          new Error("算法参数不符合格式要求")
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.TextArea
                style={{ resize: "none", height: "100px" }}
                placeholder='"penalty":"L2",&#10;"optimizer":"rmsprop",&#10;"alpha":"0.01",&#10;......'
              />
            </Form.Item>
            <Form.Item style={{ margin: 0, padding: 0 }} {...tailLayout}>
              <a
                onClick={() => {
                  this.setState({
                    modal: true,
                  });
                }}
                style={{ textDecorationStyle: "none" }}
              >
                查看参数说明
              </a>
            </Form.Item>
            <Form.Item
              name="isScale"
              label={<div style={fontStyle}>isScale</div>}
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked
              />
            </Form.Item>

            <Form.Item
              name="percent"
              label={<div style={fontStyle}>测试数据集百分比</div>}
              rules={[
                {
                  required: true,
                  message: "请输入测试数据集百分比",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="请输入小数,如0.1"
                max="1"
                min="0"
                step="0.1"
              />
            </Form.Item>

            <Form.Item
              name="postScript"
              label={<div style={fontStyle}>备注信息</div>}
            >
              <Input.TextArea
                style={{ resize: "none" }}
                placeholder="备注信息可选"
              />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <a
                style={{ textDecorationStyle: "none" }}
                onClick={() => {
                  this.props.changeForm();
                }}
              >
                高级配置
              </a>
            </Form.Item>
            <Row justify={"center"}>
              <Form.Item>
                <Space size={200}>
                  <Button
                    onClick={() => {
                      this.props.history.push({
                        pathname: "/federalTrain/result",
                        state: {
                          data: this.props.location.state.data,
                          selectValue: this.props.location.state.selectValue,
                        },
                      });
                    }}
                  >
                    上一步
                  </Button>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Space>
              </Form.Item>
            </Row>
          </Form>
          <Modal
            visible={modal}
            onCancel={() => {
              this.setState({
                modal: false,
              });
            }}
            width={"45vw"}
            footer={null}
          >
            <Table
              size={"middle"}
              bordered={false}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Modal>
        </Spin>
      </div>
    );
  }
}
export default withRouter(NormalForm);
