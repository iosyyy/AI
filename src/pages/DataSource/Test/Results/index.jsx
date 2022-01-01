import React, { Component } from "react";
import ZhiFang from "../../ResultGrapths/ZhiFang";
import Sandian from "../../ResultGrapths/Sandian";
import { DataSourceType } from "../../../../util/dataSourceReultEnum";
import ReLi from "../../ResultGrapths/ReLi";
import { Button, Space } from "antd";
import { exportPDF } from "../../../../util/exportPdf";
import TreeSet from "./TreeSet";

class DataSourceTestResults extends Component {
  render() {
    const type = localStorage.getItem("dataSourceResultType");
    console.log(localStorage.getItem("feature"));
    let comResult = <>当前分析为空请重试</>;
    switch (type) {
      case DataSourceType.ZhiFang:
        comResult = (
          <div id="exportPdf">
            <ZhiFang />
          </div>
        );
        break;
      case DataSourceType.SanDian:
        comResult = (
          <div id="exportPdf">
            <Sandian type="zhifang"/>
          </div>
        );
        break;
      case DataSourceType.ReLi:
        comResult = (
          <div id="exportPdf">
            <ReLi />
          </div>
        );
        break;
      case DataSourceType.kMeans:
        comResult = (
          <div id="exportPdf">
            <Sandian type="k-means"/>
          </div>
        );
        break;
      case DataSourceType.decisionTree:
        comResult = (
          <div id="exportPdf">
            <TreeSet />
          </div>
        );
        break;
    }
    return (
      <div id={"allExportPdf"} className="card-container">
        <Space style={{ marginBottom: "5px" }}>
          <Button
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            返回上一页
          </Button>
          {type ? (
            <Button
              onClick={() => {
                exportPDF(`${type}`, "exportPdf");
              }}
              type={"primary"}
            >
              导出为pdf
            </Button>
          ) : (
            <></>
          )}
        </Space>
        {comResult}
      </div>
    );
  }
}

export default DataSourceTestResults;
