import React, { Component } from "react";
import { Form, Input, Button, Upload, message, Space } from "antd";
import axios from "axios";
import api from "../../../config/api";
import FileSaver from "file-saver";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";

class FederalTrainChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainName: "homo_logistic_regression",
      fileList1: [],
      fileList2: [],
    };
  }

  downloadTempalte(fileName) {
    axios
      .post(api.downloadTemplate, {
        file_name: fileName,
      })
      .then((f) => {
        let jsonObj = f.data;
        let jsonStr = JSON.stringify(jsonObj, null, "  ");
        let file = new Blob([jsonStr], { type: "" });
        FileSaver.saveAs(file, fileName + ".json");
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
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList1.indexOf(file);
          const newFileList = state.fileList1.slice();
          newFileList.splice(index, 1);
          return {
            fileList1: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState((state) => ({
          fileList1: [file],
        }));
        return false;
      },
      fileList: fileList1,
    };
    // upload组件属性
    const props2 = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList2.indexOf(file);
          const newFileList = state.fileList2.slice();
          newFileList.splice(index, 1);
          return {
            fileList2: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState((state) => ({
          fileList2: [file],
        }));
        return false;
      },
      fileList: fileList2,
    };

    return (
      <div style={{ height: "80vh" }} className="site-layout-content">
        <StepsTemplate
          steps={[
            { status: "finish", title: "联邦类型", icon: <FileOutlined /> },
            {
              status: "finish",
              title: "数据上传",
              icon: <CloudUploadOutlined />,
            },
            {
              status: "process",
              title: "参数配置",
              icon: <DownloadOutlined />,
            },
          ]}
        />
        <Form
          size={"middle"}
          onFinish={(e) => {
            let { trainName } = e;
            let { fileList1, fileList2 } = this.state;
            const formData = new FormData();
            formData.append("train_name", trainName);
            fileList1.forEach((file) => {
              formData.append("config_file", file);
            });
            fileList2.forEach((file) => {
              formData.append("dsl_file", file);
            });
            if (formData.get("config_file") && formData.get("dsl_file")) {
              axios({
                url: api.beginTrain,
                method: "post",
                processData: false,
                data: formData,
              })
                .then((res) => {
                  console.log(res)
                  if (JSON.parse(res.data.body).retcode === 0) {
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
                    message.error("上传失败");
                    console.error(res);
                  }
                })
                .catch((res) => {
                  message.error("上传失败");
                  console.error(res);
                });
            } else {
              message.error("请提交文件config文件与dsl文件");
            }
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
            <Space>
              <Upload {...props1}>
                <Button type="primary">选择文件</Button>
              </Upload>
              <Button
                type="primary"
                style={{ width: "130px" }}
                onClick={() => {
                  this.downloadTempalte("config_file");
                }}
              >
                下载config模版
              </Button>
            </Space>
          </Form.Item>

          <Form.Item name="dslFile" label="dsl_file">
            <Space>
              <Upload {...props2}>
                <Button type="primary">选择文件</Button>
              </Upload>
              <Button
                type="primary"
                style={{ width: "130px" }}
                onClick={() => {
                  this.downloadTempalte("dsl_file");
                }}
              >
                下载dsl模版
              </Button>
            </Space>
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
              >
                上一步
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FederalTrainChoice;
