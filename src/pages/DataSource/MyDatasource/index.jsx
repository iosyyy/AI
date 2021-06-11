import React, { Component } from "react";
import MyDatasourceTable from "./myDatasourceTable";

class MyDatasource extends Component {
  render() {
    return (
      <div
        style={{ height: "83vh", width: "83vw" }}
        className="site-layout-content"
      >
        <h2 className="colorWhite">我的数据源</h2>
        <MyDatasourceTable />
      </div>
    );
  }
}

export default MyDatasource;
