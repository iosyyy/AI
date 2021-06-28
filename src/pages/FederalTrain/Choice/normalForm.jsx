import React, { Component } from "react";
import { Form, Input, Button, message, Space, Radio } from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import api from "../../../config/api";
import { number } from "echarts";

class NormalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  render() {
    const { loading } = this.state;

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
      <div>
        <Form
          name='normalConfig'
          size={"middle"}
          onFinish={e => {
            const { setLoading } = this.props;

            this.setState({
              loading: true,
            });
            setLoading(true);
            const formData = new FormData();
            let guest = this.props.guest;
            let host = this.props.host;
            let algorithmParms = e.algorithmParms
              ? JSON.parse("{" + e.algorithmParms + "}")
              : {};
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
                isScale: e.isScale,
                test_size: percent,
              },
            }).then(
              data => {
                console.log(data);
                if (data.data.retcode == 0) {
                  message.success("上传成功");
                  this.props.history.push({
                    pathname: "/training",
                    state: { data: data.data },
                  });
                } else {
                  message.success("上传失败1");
                }
              },
              () => {
                message.success("上传失败2");
              }
            );

            this.setState({
              loading: false,
            });
            setLoading(false);
          }}
          {...layout}
          onFinishFailed={e => {
            console.log(e);
          }}
        >
          <Form.Item
            name='trainName'
            label='任务名称'
            rules={[
              { required: true, whitespace: true, message: "请输入任务名称" },
            ]}
          >
            <Input placeholder='请输入任务名称' />
          </Form.Item>

          <Form.Item
            name='trainType'
            label='任务类型'
            rules={[{ required: true, message: "请选择任务类型" }]}
          >
            <Radio.Group>
              <Radio value={0}>单机</Radio>
              <Radio value={1}>多机</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 采用算法是上个页面传过来的,目前写死为 homo_logistic_regression */}
          <Form.Item
            name='algorithm'
            label='采用算法'
            initialValue='homo_logistic_regression'
            rules={[
              { required: true, whitespace: true, message: "请输入采用算法" },
            ]}
          >
            <Input placeholder='请输入采用算法' disabled />
          </Form.Item>

          <Form.Item
            name='algorithmParms'
            label='算法参数'
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.resolve();
                  }
                  let jsonVal = "{" + value + "}";
                  try {
                    JSON.parse(jsonVal);
                  } catch {
                    return Promise.reject(new Error("算法参数不符合格式要求"));
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

          <Form.Item
            name='isScale'
            label='isScale'
            rules={[{ required: true, message: "请选择isScale" }]}
          >
            <Radio.Group>
              <Radio value={"True"}>是</Radio>
              <Radio value={"False"}>否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name='percent'
            label='测试数据集百分比'
            rules={[
              {
                required: true,
                message: "请输入测试数据集百分比",
              },
            ]}
          >
            <Input
              type='number'
              placeholder='请输入小数,如0.1'
              max='1'
              min='0'
              step='0.1'
            ></Input>
          </Form.Item>

          <Form.Item name='postScript' label='备注信息'>
            <Input.TextArea
              style={{ resize: "none" }}
              placeholder='备注信息可选'
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

          <Form.Item {...tailLayout} style={{ marginTop: "4vh" }}>
            <Space size={200}>
              <Button
                style={{ background: "rgb(201,201,201)" }}
                onClick={() => {
                  this.props.history.push({
                    pathname: "/federalTrain/result",
                  });
                }}
                size='large'
              >
                上一步
              </Button>
              <Button
                loading={loading}
                type='primary'
                htmlType='submit'
                size='large'
              >
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default withRouter(NormalForm);
