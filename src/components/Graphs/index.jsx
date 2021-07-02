import React, { Component } from "react";
import { Button, Row, Space, Tabs } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import axios from "axios";
import _ from "underscore";
import api from "../../config/api";
import { message } from "antd/es";

const { TabPane } = Tabs;

let myChart;
const graphType = {
  Roc: "1",
  "K-S": "2",
  Lift: "3",
  Gain: "4",
  "Precision Recall": "5",
  Accuracy: "6",
};

export default class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cur: graphType.Roc,
      title: "Roc",
      RocData: { state: -1 },
      KSData: { state: -1 },
      LiftData: { state: -1 },
      GainData: { state: -1 },
      PrecisionRecallData: { state: -1 },
      AccuracyData: { state: -1 },
    };
  }

  drew = () => {
    let dom = document.getElementById("metricsGraphs");
    myChart.clear();
    if (myChart != null && myChart !== "" && myChart !== undefined) {
      myChart.dispose(); //销毁
    }
    myChart = echarts.init(dom);
    switch (this.state.cur) {
      case graphType.Roc:
        this.drewRoc();
        break;
      case graphType["K-S"]:
        this.drewKS();
        break;
      case graphType.Lift:
        this.drewLift();
        break;
      case graphType.Gain:
        this.drewGain();
        break;
      case graphType["Precision Recall"]:
        this.drewPrecisionRecall();
        break;
      case graphType.Accuracy:
        this.drewAccuracy();
        break;

      default:
        this.drewRoc();
        break;
    }
  };
  drewRoc = () => {
    let train = _.intersection(["homo_lr_0_roc"], this.props.metrics.train);
    let that = this;
    let data;
    let option;
    let thresholds;
    let { RocData } = this.state;
    if (RocData.state === -1) {
      axios
        .post(api.batch, {
          ...this.props.post_data,
          metrics: {
            train,
          },
        })
        .then((r) => {
          let { code, msg } = r.data;
          if (code !== 0) {
            message.error(`${code}: ${msg}`);
            return;
          }
          if (r.data.data) data = r.data.data.train["homo_lr_0_roc"].data;
          thresholds = r.data.data.train["homo_lr_0_roc"].meta.thresholds;
          let RocData = {
            state: 0,
            data,
            thresholds,
          };
          that.setState({
            RocData,
          });
        });
    } else {
      data = RocData.data;
      thresholds = RocData.thresholds;
    }
    option = {
      tooltip: {
        trigger: "axis",
        displayMode: "single",
        formatter: function (params) {
          let dataset = that.props.metrics.train[0];
          let htmlStr = "<div>";
          params.forEach((item, index) => {
            htmlStr += "Thresholds：" + thresholds[item["dataIndex"]] + "<br/>";
            htmlStr += `Tpr(${dataset})：` + item.value + "<br/>";
            htmlStr += `Fpr(${dataset})：` + item.axisValue + "<br/>";
            if (index != params.length - 1) {
              htmlStr += "<br/>";
            }
          });
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      xAxis: {
        type: "value",
        name: "fpr",
      },
      yAxis: {
        type: "value",
        name: "tpr",
      },
      series: [
        {
          name: "Roc",
          type: "line",
          data: data,
          areaStyle: {},
        },
      ],
    };
    myChart.setOption({ ...option }, 200);
  };
  drewKS = () => {
    let train = _.intersection(
      ["homo_lr_0_ks_fpr", "homo_lr_0_ks_tpr"],
      this.props.metrics.train
    );
    let that = this;

    let tpr, fpr;
    let option;
    let thresholds;

    let { KSData } = this.state;
    if (KSData.state === -1) {
      axios
        .post(api.batch, {
          ...this.props.post_data,
          metrics: {
            train,
          },
        })
        .then((r) => {
          let { code, msg } = r.data;
          if (code !== 0) {
            message.error(`${code}: ${msg}`);
          }

          tpr = r.data.data.train["homo_lr_0_ks_tpr"].data;
          fpr = r.data.data.train["homo_lr_0_ks_fpr"].data;
          thresholds = r.data.data.train["homo_lr_0_ks_tpr"].meta.thresholds;

          that.setState({
            KSData: {
              state: 0,
              tpr,
              fpr,
              thresholds,
            },
          });
        });
    } else {
      tpr = KSData.tpr;
      fpr = KSData.fpr;
      thresholds = KSData.thresholds;
    }
    option = {
      tooltip: {
        trigger: "axis",
        displayMode: "single",
        formatter: function (params) {
          let dataset = that.props.metrics.train[0];
          let htmlStr = "<div>";
          // params[0]是tpr
          // params[1]是fpr
          htmlStr +=
            `Thresholds(${dataset})：` +
            thresholds[params[0]["dataIndex"]] +
            "<br/>";
          htmlStr += `homo_lr_0_ks_fpr：` + params[0].value[1] + "<br/>";
          htmlStr += `homo_lr_0_ks_tpr：` + params[1].value[1] + "<br/>";
          htmlStr +=
            `K-S：` + (params[0].value[1] - params[1].value[1]) + "<br/>";
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "value",
        name: "tpr,fpr",
      },
      series: [
        {
          name: "tpr",
          type: "line",
          data: tpr,
          symbol: "none",
        },
        {
          name: "fpr",
          type: "line",
          data: fpr,
          symbol: "none",
        },
      ],
    };
    myChart.setOption({ ...option }, 200);
  };
  drewLift = () => {
    let train = _.intersection(["homo_lr_0_lift"], this.props.metrics.train);
    let that = this;

    let lift;
    let option;
    let thresholds;

    let { LiftData } = this.state;
    if (LiftData.state === -1) {
      axios
        .post(api.batch, {
          ...this.props.post_data,
          metrics: {
            train,
          },
        })
        .then((r) => {
          let { code, msg } = r.data;
          if (code !== 0) {
            message.error(`${code}: ${msg}`);
          }

          lift = r.data.data.train["homo_lr_0_lift"].data;
          thresholds = r.data.data.train["homo_lr_0_lift"].meta.thresholds;
          that.setState({
            LiftData: {
              state: 0,
              thresholds,
              lift,
            },
          });
        });
    } else {
      lift = LiftData.lift;
      thresholds = LiftData.thresholds;
    }
    option = {
      tooltip: {
        trigger: "axis",
        displayMode: "single",
        formatter: function (params) {
          let dataset = that.props.metrics.train[0];
          let htmlStr = "<div>";
          params.forEach((item, index) => {
            htmlStr +=
              `Thresholds(${dataset})：` +
              thresholds[item["dataIndex"]] +
              "<br/>";
            htmlStr += `Lift(${dataset})：` + item.value[1] + "<br/>";
            if (index != params.length - 1) {
              htmlStr += "<br/>";
            }
          });
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "value",
        name: "lift",
      },
      series: [
        {
          name: "lift",
          type: "line",
          data: lift,
          symbol: "none",
        },
      ],
    };
    myChart.setOption({ ...option }, 200);
  };
  drewGain = () => {
    let train = _.intersection(["homo_lr_0_gain"], this.props.metrics.train);
    let that = this;

    let gain;
    let option;
    let thresholds;

    let { GainData } = this.state;
    if (GainData.state === -1) {
      axios
        .post(api.batch, {
          ...this.props.post_data,
          metrics: {
            train,
          },
        })
        .then((r) => {
          let { code, msg } = r.data;
          if (code !== 0) {
            message.error(`${code}: ${msg}`);
          }

          gain = r.data.data.train["homo_lr_0_gain"].data;
          thresholds = r.data.data.train["homo_lr_0_gain"].meta.thresholds;
          that.setState({
            GainData: {
              state: 0,
              thresholds,
              gain,
            },
          });
        });
    } else {
      gain = GainData.gain;
      thresholds = GainData.thresholds;
    }
    option = {
      tooltip: {
        trigger: "axis",
        displayMode: "single",
        formatter: function (params) {
          let dataset = that.props.metrics.train[0];
          let htmlStr = "<div>";
          params.forEach((item, index) => {
            htmlStr +=
              `Thresholds(${dataset})：` +
              thresholds[item["dataIndex"]] +
              "<br/>";
            htmlStr += `Gain(${dataset})：` + item.value[1] + "<br/>";
            if (index != params.length - 1) {
              htmlStr += "<br/>";
            }
          });
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "value",
        name: "gain",
      },
      series: [
        {
          name: "gain",
          type: "line",
          data: gain,
          symbol: "none",
        },
      ],
    };
    myChart.setOption({ ...option }, 200);
  };
  drewPrecisionRecall = () => {
    let train = _.intersection(
      ["homo_lr_0_precision", "homo_lr_0_recall"],
      this.props.metrics.train
    );
    let that = this;

    let precision;
    let recall;
    let option;
    let thresholds;

    let { PrecisionRecallData } = this.state;
    if (PrecisionRecallData.state === -1) {
      axios
        .post(api.batch, {
          ...this.props.post_data,
          metrics: {
            train,
          },
        })
        .then((r) => {
          let { code, msg } = r.data;
          if (code !== 0) {
            message.error(`${code}: ${msg}`);
          }

          precision = r.data.data.train["homo_lr_0_precision"].data;
          recall = r.data.data.train["homo_lr_0_recall"].data;
          thresholds = r.data.data.train["homo_lr_0_precision"].meta.thresholds;

          that.setState({
            PrecisionRecallData: {
              state: 0,
              thresholds,
              precision,
              recall,
            },
          });
        });
    } else {
      precision = PrecisionRecallData.precision;
      recall = PrecisionRecallData.recall;
      thresholds = PrecisionRecallData.thresholds;
    }
    option = {
      tooltip: {
        trigger: "axis",
        displayMode: "single",
        formatter: function (params) {
          let dataset = that.props.metrics.train[0];
          let htmlStr = "<div>";
          params.forEach((item, _index) => {
            htmlStr +=
              `Thresholds(${dataset})：` +
              thresholds[item["dataIndex"]] +
              "<br/>";
            htmlStr += `Precision(${dataset})：` + item.value[1] + "<br/>";
            htmlStr +=
              `Recall(${dataset})：` + recall[item["dataIndex"]][1] + "<br/>";
          });
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "value",
        name: "precision",
      },
      series: [
        {
          name: "precision",
          type: "line",
          data: precision,
          symbol: "none",
        },
      ],
    };
    myChart.setOption({ ...option }, 200);
  };
  drewAccuracy = () => {
    let train = _.intersection(
      ["homo_lr_0_accuracy"],
      this.props.metrics.train
    );
    let that = this;

    let accuracy;
    let option;
    let thresholds;

    let { AccuracyData } = this.state;
    if (AccuracyData.state === -1) {
      axios
        .post(api.batch, {
          ...this.props.post_data,
          metrics: {
            train,
          },
        })
        .then((r) => {
          let { code, msg } = r.data;
          if (code !== 0) {
            message.error(`${code}: ${msg}`);
          }

          accuracy = r.data.data.train["homo_lr_0_accuracy"].data;
          thresholds = r.data.data.train["homo_lr_0_accuracy"].meta.thresholds;

          that.setState({
            AccuracyData: {
              state: 0,
              thresholds,
              accuracy,
            },
          });
        });
    } else {
      accuracy = AccuracyData.accuracy;
      thresholds = AccuracyData.thresholds;
    }
    option = {
      tooltip: {
        trigger: "axis",
        displayMode: "single",
        formatter: function (params) {
          let dataset = that.props.metrics.train[0];
          let htmlStr = "<div>";
          params.forEach((item, _index) => {
            htmlStr +=
              `Thresholds(${dataset})：` +
              thresholds[item["dataIndex"]] +
              "<br/>";
            htmlStr += `Accuracy(${dataset})：` + item.value[1] + "<br/>";
          });
          htmlStr += "</div>";
          return htmlStr;
        },
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "value",
        name: "accuracy",
      },
      series: [
        {
          name: "accuracy",
          type: "line",
          data: accuracy,
          symbol: "none",
        },
      ],
    };
    myChart.setOption({ ...option }, 200);
  };

  componentDidMount() {
    let dom = document.getElementById("metricsGraphs");
    myChart = echarts.init(dom);
    this.drewRoc();
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

  changeCur = (key) => {
    if (key == this.state.cur) return;
    let title;
    let cur;
    switch (key) {
      case graphType.Roc:
        cur = graphType.Roc;
        title = "Roc";
        break;
      case graphType["K-S"]:
        cur = graphType["K-S"];
        title = "K-S";
        break;
      case graphType.Lift:
        cur = graphType.Lift;
        title = "Lift";
        break;
      case graphType.Gain:
        cur = graphType.Gain;
        title = "Gain";
        break;
      case graphType["Precision Recall"]:
        cur = graphType["Precision Recall"];
        title = "Precision Recall";
        break;
      case graphType.Accuracy:
        cur = graphType.Accuracy;
        title = "Accuracy";
        break;

      default:
        cur = graphType.Roc;
        title = "Roc";
        break;
    }
    this.setState({ title, cur });
  };

  render() {
    return (
      <div>
        <Tabs
          defaultActiveKey={graphType.Roc}
          onChange={this.changeCur}
          size="large"
        >
          <TabPane tab="Roc" key={graphType.Roc} />
          <TabPane tab="K-S" key={graphType["K-S"]} />
          <TabPane tab="Lift" key={graphType.Lift} />
          <TabPane tab="Gain" key={graphType.Gain} />
          <TabPane tab="Precision Recall" key={graphType["Precision Recall"]} />
          <TabPane tab="Accuracy" key={graphType.Accuracy} />
        </Tabs>

        <Row align="middle">
          <Space>
            <font style={{ fontSize: "xx-large" }}>{this.state.title}</font>
            <Button type="primary">train</Button>
            <a
              onClick={() => {
                this.drew();
              }}
            >
              <SyncOutlined />
              refresh
            </a>
          </Space>
        </Row>
        <div id="metricsGraphs" style={{ width: "88vw", height: "70vh" }} />
      </div>
    );
  }
}
