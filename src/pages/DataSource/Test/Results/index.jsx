import React, { Component } from "react";
import ZhiFang from "../../../Tmp/ZhiFang";
import Sandian from "../../../Tmp/Sandian";
import { DataSourceType } from "../../../../util/dataSourceReultEnum";
import ReLi from "../../../Tmp/ReLi";
import { Button, Space } from "antd";
import { exportPDF } from "../../../../util/exportPdf";

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
            <Sandian />
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
            <Sandian />
          </div>
        );
        break;
      case DataSourceType.decisionTree:
        comResult = (
          <div id="exportPdf">
            <ZhiFang />
            <ReLi />
            <Sandian />
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
