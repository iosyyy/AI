import React, { Component } from "react";
import { Row, Col, Button, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import * as echarts from "echarts";

let myChart;

export default class Loss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lossHistory: props.lossHistory,
    };
  }

  drew() {
    let option;
    let data1 = [],
      data2 = [];
    this.state.lossHistory.forEach((item, index) => {
      data1.push(String(index));
      data2.push(item);
    });
    option = {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let htmlStr = "<div>";
          htmlStr += "iteration：" + params[0].axisValue + "<br/>";
          htmlStr += "loss：" + params[0].value;
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      legend: {
        data: ["loss"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        name: "iter",
        data: data1,
      },
      yAxis: {
        type: "value",
        name: "loss",
      },
      series: [{ name: "loss", data: data2, type: "line" }],
    };

    myChart.setOption({ ...option }, 200);
  }

  componentDidMount() {
    let dom = document.getElementById("loss");
    myChart.clear();
    if (myChart != null && myChart !== "" && myChart !== undefined) {
      myChart.dispose(); //销毁
    }
    myChart = echarts.init(dom);
    this.drew();
  }

  componentWillUnmount() {
    //处理逻辑
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidUpdate() {
    this.drew();
  }

  render() {
    return (
      <div>
        <Row align="middle">
          <Space>
            <font style={{ fontSize: "xx-large" }}>LOSS</font>
            <Button type="primary">train</Button>
            <a
              onClick={() => {
                let dom = document.getElementById("loss");
                myChart.clear();
                if (
                  myChart != null &&
                  myChart !== "" &&
                  myChart !== undefined
                ) {
                  myChart.dispose(); //销毁
                }
                myChart = echarts.init(dom);
                this.drew();
              }}
            >
              <SyncOutlined />
              refresh
            </a>
          </Space>
        </Row>
        <div id="loss" style={{ width: "89vw", height: "70vh" }} />
      </div>
    );
  }
}
