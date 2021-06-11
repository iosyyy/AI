import React, { Component } from "react";
import DatasourceFormHandle from "./datasourceFormHandle";
import { Divider } from "antd";
import DatasourceRuleTable from "./datasourceRuleTable";

class DatasourceHandle extends Component {
  render() {
    return (
      <div
        style={{ height: "83vh", width: "83vw", overflow: "scroll" }}
        className='site-layout-content'
      >
        <h2 className='colorWhite'>数据源预处理</h2>
        <Divider orientation='left'>
          <h3 style={{ color: "rgb(65,89,209)" }}>基本信息</h3>
        </Divider>
        <DatasourceFormHandle />
        <Divider orientation='left'>
          <h3 style={{ color: "rgb(65,89,209)" }}>数据预处理字段规则定义</h3>
        </Divider>
        <DatasourceRuleTable />
      </div>
    );
  }
}

export default DatasourceHandle;
