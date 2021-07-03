import React, { Component } from "react";
import { Col, Divider, InputNumber, message, Row, Slider, Table } from "antd";
import axios from "axios";
import _, { map } from "underscore";
import api from "../../../../config/api";
import Graphs from "../../../../components/Graphs";
const TABLE_COLUMNS2 = [
  {
    title: "   ",
    dataIndex: "name",
    key: "name",
    render: (text, row, index) => {
      return {
        children: text,
        props: {
          rowSpan: index === 0 ? 2 : 0,
        },
      };
    },
    width: "10vw",
  },
  {
    title: "dataset",
    dataIndex: "dataset",
    key: "dataset",
    render: (text, row, index) => {
      return {
        children: text,
        props: {
          rowSpan: index === 0 ? 2 : 0,
        },
      };
    },
    width: "10vw",
  },
  {
    title: "F1-score",
    dataIndex: "F1-score",
    key: "F1-score",
    render: (text, row, index) => {
      return {
        children: text,
        props: {
          rowSpan: index === 0 ? 2 : 0,
        },
      };
    },
    width: "10vw",
  },
  {
    title: "true lable \\ predict lable",
    align: "center",
    dataIndex: "tlpl",
    key: "tlpl",
    width: "20vw",
    render: (text, row, index) => {
      return {
        children: <h3 style={{ color: "	#3A5FCD" }}> {text}</h3>,
        props: {
          rowSpan: 1,
        },
      };
    },
  },
  {
    title: "0",
    dataIndex: "0",
    key: "0",
    width: "10vw",
  },
  {
    title: "1",
    dataIndex: "1",
    key: "1",
    width: "10vw",
  },
];

class Metrics extends Component {
  constructor(props) {
    super(props);
    const TABLE_COLUMNS1 = [
      {
        title: "",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "dataset",
        dataIndex: "dataset",
        key: "dataset",
      },
      {
        title: "auc",
        dataIndex: "auc",
        key: "auc",
      },
      {
        title: "ks",
        dataIndex: "ks",
        key: "ks",
      },
      {
        title: "precision",
        dataIndex: "precision",
        key: "precision",
      },
      {
        title: "recall",
        dataIndex: "recall",
        key: "recall",
      },
    ];

    this.state = {
      inputValue1: 0.5,
      inputValue2: 0.5,
      tableDataSource1: [],
      tableDataSource2: [],
      p_scores: [],
      r_scores: [],
      f1_scores: [],
      thresholds: [],
      TABLE_COLUMNS1,
      isEmpty: true,
    };
  }

  componentDidMount() {
    const { post_data, metrics } = this.props;
    axios
      .post(api.batch, {
        ...post_data,
        metrics,
      })
      .then((r) => {
        let { code, msg } = r.data;
        const datas = r.data.data[Object.keys(r.data.data)[0]];
        if (
          code !== 0 ||
          Object.keys(r.data.data).length === 0 ||
          !datas ||
          Object.keys(datas).length === 0
        ) {
          message.error(`空数据异常`);
          this.setState({
            isEmpty: true,
          });
          return;
        }
        const metricArray = metrics[Object.keys(metrics)[0]];
        const homo_lr_0 = datas[metricArray[0]];
        const homo_lr_0_quantile_pr = datas[metricArray[8]];
        const homo_lr_0_f1_score = datas[metricArray[9]];
        const homo_lr_0_confusion_mat = datas[metricArray[10]];
        const dataset = Object.keys(r.data.data)[0];
        console.log(homo_lr_0_quantile_pr);
        const { p_scores, r_scores, thresholds } = homo_lr_0_quantile_pr.meta;
        // fn右下,tn右上,fp左上,tp左下
        const { fn, fp, tn, tp } = homo_lr_0_confusion_mat.meta;
        const { f1_scores } = homo_lr_0_f1_score.meta;
        const { name } = homo_lr_0.meta;
        const tableDataSource1 = [];
        const dataSource1 = {};

        const TABLE_COLUMNS1 = [
          {
            title: "",
            dataIndex: "name",
            key: "name",
            width: "10vw",
          },
        ];
        dataSource1["name"] = name;

        TABLE_COLUMNS1.push({
          title: "dataset",
          dataIndex: "dataset",
          key: "dataset",
          width: "10vw",
        });
        dataSource1["dataset"] = dataset;

        for (let value of homo_lr_0.data) {
          TABLE_COLUMNS1.push({
            title: value[0],
            dataIndex: value[0],
            key: value[0],
            width: "10vw",
          });
          dataSource1[value[0]] = value[1];
        }

        TABLE_COLUMNS1.push(
          {
            title: "precision",
            dataIndex: "precision",
            key: "precision",
            width: "10vw",
          },
          {
            title: "recall",
            dataIndex: "recall",
            key: "recall",
            width: "10vw",
          }
        );
        dataSource1["precision"] = p_scores[10][1];
        dataSource1["recall"] = r_scores[10][1];
        dataSource1["key"] = 1;
        tableDataSource1.push(dataSource1);

        // fn右下,tn右上,fp左上,tp左下
        let fn_num = fn[50];
        let tn_num = tn[50];
        let fp_num = fp[50];
        let tp_num = tp[50];
        let sum = fn_num + tn_num + fp_num + tp_num;

        const tableDataSource2 = [];
        // 第一行数据
        const dataSource2 = {
          key: 1,
          name,
          dataset,
          "F1-score": f1_scores[50],
          tlpl: "0",
          0: `${fp_num}(${(fp_num / sum) * 100}%)`,
          1: `${tn_num}(${(tn_num / sum) * 100}%)`,
        };
        // 第二行数据
        const dataSource3 = {
          key: 2,
          name,
          dataset,
          "F1-score": "0",
          tlpl: "1",
          0: `${tp_num}(${(tp_num / sum) * 100}%)`,
          1: `${fn_num}(${(fn_num / sum) * 100}%)`,
        };
        tableDataSource2.push(dataSource2);
        tableDataSource2.push(dataSource3);

        this.setState({
          isEmpty: false,

          TABLE_COLUMNS1,
          tableDataSource1,
          tableDataSource2,
          p_scores,
          r_scores,
          thresholds,
          f1_scores,
          fn,
          fp,
          tn,
          tp,
        });
      });
  }

  componentWillUnmount() {
    //处理逻辑
    this.setState = (state, callback) => {
      return;
    };
  }

  onChange1 = (value) => {
    const { tableDataSource1, p_scores, r_scores } = this.state;
    tableDataSource1[0].precision = p_scores[Math.floor(value * 20)][1];
    tableDataSource1[0].recall = r_scores[Math.floor(value * 20)][1];
    this.setState({
      inputValue1: value,
      tableDataSource1,
    });
  };

  onChange2 = (value) => {
    // fn右下,tn右上,fp左上,tp左下
    const { tableDataSource2, f1_scores, fn, tn, fp, tp } = this.state;
    tableDataSource2[0]["F1-score"] = f1_scores[Math.floor(value * 100)];

    let fn_num = fn[Math.floor(value * 100)];
    let tn_num = tn[Math.floor(value * 100)];
    let fp_num = fp[Math.floor(value * 100)];
    let tp_num = tp[Math.floor(value * 100)];
    let sum = fn_num + tn_num + fp_num + tp_num;

    tableDataSource2[0]["0"] = `${fp_num}(${(fp_num / sum) * 100}%)`;
    tableDataSource2[0]["1"] = `${tn_num}(${(tn_num / sum) * 100}%)`;
    tableDataSource2[1]["0"] = `${tp_num}(${(tp_num / sum) * 100}%)`;
    tableDataSource2[1]["1"] = `${fn_num}(${(fn_num / sum) * 100}%)`;

    this.setState({
      inputValue2: value,
      tableDataSource2,
    });
  };

  render() {
    const {
      inputValue1,
      inputValue2,
      tableDataSource1,
      tableDataSource2,
      TABLE_COLUMNS1,
      isEmpty,
    } = this.state;

    return (
      <div
        className={"scrollContent"}
        style={{ height: "65vh", padding: "2vh" }}
      >
        {isEmpty ? (
          <>
            <Row
              style={{ height: "65vh", marginTop: "2vh" }}
              justify={"center"}
            >
              <Col>
                <h1>There is no data</h1>
              </Col>
            </Row>
          </>
        ) : (
          <>
            {" "}
            <h2>Evaluation scores</h2>
            <Row>
              <Col span={4}>
                <Slider
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={this.onChange1}
                  value={inputValue1}
                />
              </Col>
              <Col>
                <InputNumber
                  min={0}
                  max={1}
                  step={0.05}
                  style={{ margin: "0 16px" }}
                  value={inputValue1}
                  onChange={this.onChange1}
                />
              </Col>
            </Row>
            <Table
              columns={TABLE_COLUMNS1}
              bordered={false}
              size={"small"}
              pagination={false}
              dataSource={tableDataSource1}
            />
            <Divider style={{ margin: "3vh 0", height: "5px" }} />
            <h2>Confusion Matrix</h2>
            <Row>
              <Col span={4}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={this.onChange2}
                  value={inputValue2}
                />
              </Col>
              <Col>
                <InputNumber
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ margin: "0 16px" }}
                  value={inputValue2}
                  onChange={this.onChange2}
                />
              </Col>
            </Row>
            <Divider style={{ margin: "3vh 0", height: "5px" }} />
            <Table
              columns={TABLE_COLUMNS2}
              bordered={false}
              size={"small"}
              pagination={false}
              dataSource={tableDataSource2}
            />
            <Divider style={{ margin: "3vh 0", height: "5px" }} />
            <Graphs
              metrics={this.props.metrics}
              post_data={this.props.post_data}
            />
          </>
        )}
      </div>
    );
  }
}

export default Metrics;
