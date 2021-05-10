import React, { Component } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import axios from "axios";
import api from "../../../config/api";

class FederalTrainChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainName: "homo_logistic_regression",
      fileList1: [],
      fileList2: [],
    };
  }

  render() {
    // 表单样式
    const tailLayout = {
      wrapperCol: { offset: 12, span: 8 },
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
      <div>
        <Form
          size={"middle"}
          onFinish={e => {
            let { trainName } = e;
            let { fileList1, fileList2 } = this.state;
            const formData = new FormData();
            formData.append("train_name", trainName);
            fileList1.forEach(file => {
              formData.append("config_file", file);
            });
            fileList2.forEach(file => {
              formData.append("dsl_file", file);
            });
            axios({
              url: api.beginTrain,
              method: "post",
              processData: false,
              data: formData,
            })
              .then(res => {
                if (res.data.retcode === 0) {
                  this.setState({
                    fileList1: [],
                    fileList2: [],
                  });
                  message.success("上传成功");
                  this.props.history.push({
                    pathname: "/traning",
                    state: { data: res.data },
                  });
                } else {
                  message.error("上传失败");
                  console.error(res);
                }
              })
              .catch(res => {
                message.error("上传失败");
                console.error(res);
              });
          }}
          {...layout}
        >
          <Form.Item
            name="trainName"
            label="train_name"
            initialValue={this.state.trainName}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item name="configFile" label="config_file">
            <Upload {...props1}>
              <Button type="primary">选择文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="dslFile" label="dsl_file">
            <Upload {...props2}>
              <Button type="primary">选择文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: "15vh" }} {...tailLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FederalTrainChoice;
