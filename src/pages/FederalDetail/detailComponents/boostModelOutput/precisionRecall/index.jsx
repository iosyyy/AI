import React, { Component } from "react";
import * as echarts from "echarts";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../../../../config/api";

let myChart;
export default class PrecisionRecall extends Component {
  constructor(props) {
    super(props);
    const { allMetrics, metricsKeys } = props;
    console.log(props);
    let metricsKey = metricsKeys[0];
    let metricsForPrecisionRecall = {};
    if (metricsKey && allMetrics) {
      metricsForPrecisionRecall = allMetrics[metricsKey].filter((item) =>
        item.match(/^iteration_[0-9]_(precision)|(recall)$/g)
      );
    }
    this.state = {
      metricsForPrecisionRecall,
    };
  }
  drew = (type) => {
    const { metricsKeys } = this.props;
    let { datas, metricsForPrecisionRecall } = this.state;
    console.log(type);
    let metricsKey = type ? type : metricsKeys[0];
    let metrics = {};
    // TODO:此处根据选择改变metricsKeys
    metrics[metricsKey] = metricsForPrecisionRecall;
    let postData = {
      ...this.props.postData,
      metrics,
    };
    console.log("postdata:", postData);
    let option;
    let d;

    axios.post(api.batch, postData).then((r) => {
      d = r.data.data[metricsKey];

      let dKeys = Object.keys(d);
      let series = [];

      for (let dKey of dKeys) {
        series.push({
          name:
            d[dKey].meta.ordinate_name + "(" + d[dKey].meta.curve_name + ")",
          type: "line",
          data: d[dKey].data,
          symbol: "none",
        });
      }
      option = {
        tooltip: {
          trigger: "axis",
          displayMode: "single",
          formatter: function (params) {
            let htmlStr = "<div>";
            htmlStr += `Class:${params[0].axisValue} <br/>`;
            for (let i = 0; i < params.length; i++) {
              htmlStr += `${params[i].seriesName}:${params[i].data[1]} <br/>`;
            }
            htmlStr += "</div>";
            return htmlStr;
          },
        },
        xAxis: {
          type: "value",
          name: "class",
        },
        yAxis: {
          type: "value",
          name: "precision,recall",
        },
        series,
      };
      myChart.setOption({ ...option });
    });
  };

  componentDidMount() {
    let dom = document.getElementById("precisionRecall");
    myChart = echarts.init(dom);
    this.drew();
  }

  componentDidUpdate() {
    this.drew();
  }
  render() {
    const { metricsKeys } = this.props;
    let buttonArr = [];
    for (let key of metricsKeys) {
      buttonArr.push(
        <Button
          type="primary"
          style={{ marginRight: "2px" }}
          onClick={() => {
            this.drew(key);
          }}
        >
          {key}
        </Button>
      );
    }
    return (
      <div>
        <span
          style={{
            fontSize: 24,
            fontWeight: "bold",
            display: "inline-block",
            marginRight: "5px",
          }}
        >
          Precision Recall
        </span>
        {buttonArr}
        <Button
          type="link"
          onClick={() => {
            this.drew();
          }}
        >
          <ReloadOutlined />
          refresh
        </Button>
        <div id="precisionRecall" style={{ width: "88vw", height: "70vh" }} />
      </div>
    );
  }
}
