import React, { Component } from "react";
import { Form, Input, Button, Upload, message, Space, Spin } from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import api from "../../../config/api";
import FileSaver from "file-saver";

class AdvancedForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainName: "homo_logistic_regression",
      fileList1: [],
      fileList2: [],
      loading: false,
    };
  }

  downloadTempalte(path, fileName) {
    axios
      .post(api.downloadTemplate, {
        file_name: path + "/" + fileName,
      })
      .then(f => {
        let jsonObj = f.data;
        let jsonStr = JSON.stringify(jsonObj, null, "  ");
        let file = new Blob([jsonStr], { type: "" });
        FileSaver.saveAs(file, fileName);
      });
  }

  render() {
    // 表单样式
    const tailLayout = {
      wrapperCol: { offset: 9 },
    };
    // 表单样式
    const layout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 8 },
    };
    // state数据
    const { fileList1, fileList2 } = this.state;
    // upload组件属性
    const props1 = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList1.indexOf(file);
          const newFileList = state.fileList1.slice();
          newFileList.splice(index, 1);
          return {
            fileList1: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList1: [file],
        }));
        return false;
      },
      fileList: fileList1,
    };
    // upload组件属性
    const props2 = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList2.indexOf(file);
          const newFileList = state.fileList2.slice();
          newFileList.splice(index, 1);
          return {
            fileList2: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList2: [file],
        }));
        return false;
      },
      fileList: fileList2,
    };
    return (
      <Spin size='large' spinning={this.state.loading}>
        <Form
          size={"middle"}
          onFinish={e => {
            this.setState({
              loading: true,
            });

            let { trainName } = e;
            let { fileList1, fileList2 } = this.state;
            const formData = new FormData();
            formData.append("train_algorithm_name", trainName);
            formData.append("config_type", 1);
            fileList1.forEach(file => {
              formData.append("config_file", file);
            });
            fileList2.forEach(file => {
              formData.append("dsl_file", file);
            });
            if (
              formData.get("config_file") &&
              formData.get("dsl_file") &&
              formData.get("train_algorithm_name")
            ) {
              axios.post(api.beginHighTrain, formData).then(
                res => {
                  if (res.data.retcode === 0 || res.data.code === 0) {
                    this.setState({
                      fileList1: [],
                      fileList2: [],
                    });
                    message.success("上传成功");
                    this.props.history.push({
                      pathname: "/training",
                      state: { data: res.data },
                    });
                  } else {
                    this.setState({
                      loading: false,
                    });
                    message.error("上传失败");
                  }
                },
                res => {
                  this.setState({
                    loading: false,
                  });
                  message.error("上传失败");
                }
              );
            } else {
              message.error("请提交文件config文件与dsl文件");
              this.setState({
                loading: false,
              });
              setLoading(loading);
            }
          }}
          {...layout}
        >
          <Form.Item
            name='trainName'
            label='train_name'
            initialValue={this.state.trainName}
            rules={[{ required: true, message: "请输入任务名称" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name='configFile'
            label='config_file'
            rules={[{ required: true, message: "请添加config文件" }]}
          >
            <div
              style={{
                width: "260px",
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Upload {...props1}>
                <Button type='primary'>选择文件</Button>
              </Upload>
              <Button
                type='primary'
                style={{ width: "130px", position: "absolute", right: "10px" }}
                onClick={() => {
                  this.downloadTempalte(
                    "/fate/examples/dsl/v1/homo_logistic_regression",
                    "test_homolr_train_job_conf.json"
                  );
                }}
              >
                下载config模版
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name='dslFile'
            label='dsl_file'
            rules={[{ required: true, message: "请添加dsl文件" }]}
          >
            <div
              style={{
                width: "260px",
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Upload {...props2}>
                <Button type='primary'>选择文件</Button>
              </Upload>
              <Button
                type='primary'
                style={{ width: "130px", position: "absolute", right: "10px" }}
                onClick={() => {
                  this.downloadTempalte(
                    "/fate/examples/dsl/v1/homo_logistic_regression",
                    "test_homolr_train_job_dsl.json"
                  );
                }}
              >
                下载dsl模版
              </Button>
            </div>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <a
              style={{ textDecorationStyle: "none" }}
              onClick={() => {
                this.props.changeForm();
              }}
            >
              普通配置
            </a>
          </Form.Item>

          <Form.Item {...tailLayout} style={{ marginTop: "10vh" }}>
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
              <Button type='primary' htmlType='submit' size='large'>
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}
export default withRouter(AdvancedForm);
