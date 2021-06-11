import React, { Component } from "react";
import DatasourceFormHandle from "./datasourceFormHandle";
import { Button, Divider, Space } from "antd";
import DatasourceRuleTable from "./datasourceRuleTable";
import PubSubJS from "pubsub-js";

class DatasourceHandle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        datasource: "",
        tableCode: "",
        namespace: "",
        tableName: "",
        deleteData: true,
      },
    };
  }

  componentDidMount() {
    PubSubJS.publish("datasourcePage", { page: "3" });
  }

  getFormData = (data) => {
    this.setState({
      formData: data,
    });
  };

  render() {
    const { formData } = this.state;
    return (
      <div
        style={{ height: "83vh", width: "83vw", overflow: "scroll" }}
        className="site-layout-content"
      >
        <h2 style={{ marginBottom: "3vh" }} className="colorWhite">
          数据源预处理
        </h2>
        <Divider orientation="left">
          <h3 style={{ color: "rgb(93,176,215)" }}>基本信息</h3>
        </Divider>
        <DatasourceFormHandle
          formData={formData}
          disabled={false}
          getFormData={this.getFormData}
        />
        <Divider orientation="left">
          <h3 style={{ color: "rgb(93,176,215)" }}>数据预处理字段规则定义</h3>
        </Divider>
        <DatasourceRuleTable />
        <Space size={30} style={{ marginTop: "2vh", marginLeft: "3vw" }}>
          <Button type="primary">保存</Button>
          <Button type="primary">关闭</Button>
        </Space>
      </div>
    );
  }
}

export default DatasourceHandle;
