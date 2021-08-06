import React, { Component } from "react";
import DatasourceFormHandle from "./datasourceFormHandle";
import { Button, Divider, message, Space, Spin } from "antd";
import DatasourceRuleTable from "./datasourceRuleTable";
import PubSubJS from "pubsub-js";
import { withRouter } from "react-router-dom";
import axios from "axios";
import api from "../../../config/api";

class DatasourceHandle extends Component {
  constructor(props) {
    super(props);
    let data = props.location.state.data;
    let type = props.location.state.type;
    let tableInfo = data.obj;
    let formData =
      type === 0
        ? {
            originalDatasource: data.tableName,
            tableName: "",
            namespace: "",
            description: "",
            work_mode: 0,
          }
        : {
            originalDatasource: data.history_table_name,
            tableName: data.tableName,
            namespace: data.namespace,
            description: data.note,
            work_mode: data.work_mode,
          };

    this.state = {
      formData,
      type,
      filepath: data.file,
      curJobId: data["job_id"],
      datasource: [],
      isLoading: false,
      tableInfo,
    };
  }

  componentDidMount() {
    PubSubJS.publish("datasourcePage", { page: "3" });
  }

  setDatasource = (datasource) => {
    this.setState({ datasource });
  };

  setFormData = (data) => {
    this.setState({
      formData: data,
    });
  };

  render() {
    return (
      <Spin size="large" spinning={this.state.isLoading}>
        <div
          style={{ height: "83vh", width: "83vw", overflow: "scroll" }}
          className="site-layout-content"
        >
          <h2 style={{ marginBottom: "3vh" }} className="colorWhite">
            {this.state.type === 0 ? "数据源预处理" : "预处理数据查询"}
          </h2>
          <Divider orientation="left">
            <h3 style={{ color: "rgb(93,176,215)" }}>基本信息</h3>
          </Divider>
          <DatasourceFormHandle
            formData={this.state.formData}
            type={this.state.type}
            setFormData={this.setFormData}
          />
          <Divider orientation="left">
            <h3 style={{ color: "rgb(93,176,215)" }}>数据预处理字段规则定义</h3>
          </Divider>
          <DatasourceRuleTable
            tableInfo={this.state.tableInfo}
            datasource={this.state.datasource}
            setDatasource={this.setDatasource}
            curJobId={this.state.curJobId}
            type={this.state.type}
            filepath={this.state.filepath}
          />
          <Space size={30} style={{ marginTop: "2vh", marginLeft: "3vw" }}>
            {this.state.type === 0 ? (
              <Button
                type="primary"
                onClick={() => {
                  let { datasource, filepath, formData } = this.state;
                  if (formData.namespace === "" || formData.tableName === "") {
                    message.error("数据表名或命名空间没有填写");
                    return;
                  }
                  this.setState({
                    isLoading: true,
                  });
                  datasource = datasource.map((item) => ({
                    label: item.label,
                    description: item.description,
                    is_use: item.is_use,
                    type: item.type,
                    content: item.content,
                  }));
                  axios
                    .post(api.preprocess, {
                      file_path: filepath,
                      history_table_name: formData.originalDatasource,
                      table_name: formData.tableName,
                      namespace: formData.namespace,
                      description: formData.description,
                      work_mode: formData.work_mode,
                      label_info: datasource,
                    })
                    .then((data) => {
                      if (data.data.code === 0 || data.data.retcode === 0) {
                        message.success("保存成功");

                        setTimeout(() => {
                          this.setState({
                            isLoading: false,
                          });
                          this.props.history.push(
                            "/datasource/datasourceManage"
                          );
                        }, 1000);
                      } else {
                        message.error("保存失败");
                        this.setState({
                          isLoading: false,
                        });
                      }
                    })
                    .catch((e) => {
                      message.error("保存失败");
                      this.setState({
                        isLoading: false,
                      });
                    });
                }}
              >
                保存
              </Button>
            ) : null}
            <Button
              type="primary"
              onClick={() => {
                if (this.state.type === 0) {
                  this.props.history.push("/datasource/datasourceManage");
                } else {
                  this.props.history.push("/datasource/myDatasource");
                }
              }}
            >
              关闭
            </Button>
          </Space>
        </div>
      </Spin>
    );
  }
}

export default withRouter(DatasourceHandle);
