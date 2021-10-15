import React, { Component } from "react";
import MyDatasourceTable from "./myDatasourceTable";
import PubSubJS from "pubsub-js";

class MyDatasource extends Component {
  componentDidMount() {
    PubSubJS.publish("datasourcePage", { page: "2" });
  }

  render() {
    return (
      <div
        style={{ height: "83vh", width: "auto" }}
        className="site-layout-content"
      >
        <h2 className="colorWhite">预处理数据管理</h2>
        <MyDatasourceTable />
      </div>
    );
  }
}

export default MyDatasource;
