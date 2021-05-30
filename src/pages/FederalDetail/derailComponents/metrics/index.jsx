import React, { Component } from "react";
import { Col, Divider, InputNumber, message, Row, Slider, Table } from "antd";
import axios from "axios";
import api from "../../../../config/api";
import _, { map } from "underscore";
const { Column, ColumnGroup } = Table;

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
      tableDataSource: [],
      p_scores: [],
      r_scores: [],
      thresholds: [],
      TABLE_COLUMNS1,
    };
  }

  componentDidMount() {
    const { post_data, metrics } = this.props;
    // 求交集
    let train = _.intersection(
      [
        "homo_lr_0",
        "homo_lr_0_confusion_mat",
        "homo_lr_0_f1_score",
        "homo_lr_0_quantile_pr",
      ],
      metrics.train
    );
    axios
      .post(api.batch, {
        ...post_data,
        metrics: {
          train,
        },
      })
      .then((r) => {
        let { code, msg } = r.data;
        if (code !== 0) {
          message.error(`${code}: ${msg}`);
        }

        const dataset = Object.keys(r.data.data)[0];
        const { homo_lr_0_quantile_pr, homo_lr_0 } = r.data.data[dataset];
        const { p_scores, r_scores, thresholds } = homo_lr_0_quantile_pr.meta;
        const { name } = homo_lr_0.meta;

        const tableDataSource = [];
        const dataSource = {};

        const TABLE_COLUMNS1 = [
          {
            title: "",
            dataIndex: "name",
            key: "name",
            width: "10vh",
          },
        ];
        dataSource["name"] = name;

        for (let value of homo_lr_0.data) {
          TABLE_COLUMNS1.push({
            title: value[0],
            dataIndex: value[0],
            key: value[0],
            width: "10vh",
          });
          dataSource[value[0]] = value[1];
        }

        TABLE_COLUMNS1.push(
          {
            title: "precision",
            dataIndex: "precision",
            key: "precision",
            width: "10vh",
          },
          {
            title: "recall",
            dataIndex: "recall",
            key: "recall",
            width: "10vh",
          }
        );

        dataSource["precision"] = p_scores[10][1];
        dataSource["recall"] = r_scores[10][1];
        tableDataSource.push(dataSource);

        this.setState({
          TABLE_COLUMNS1,
          tableDataSource,
          p_scores,
          r_scores,
          thresholds,
        });
      });
  }

  onChange1 = (value) => {
    const { tableDataSource, p_scores, r_scores } = this.state;
    tableDataSource[0].precision = p_scores[value * 20][1];
    tableDataSource[0].recall = r_scores[value * 20][1];
    this.setState({
      inputValue1: value,
      tableDataSource,
    });
  };

  onChange2 = (value) => {
    this.setState({
      inputValue2: value,
    });
  };

  render() {
    const {
      inputValue1,
      inputValue2,
      tableDataSource,
      TABLE_COLUMNS1,
    } = this.state;

    return (
      <div style={{ height: "60vh" }}>
        <h1>Evaluation scores</h1>
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
          size={"middle"}
          pagination={false}
          dataSource={tableDataSource}
        />
        <Divider />

        <h1>Confusion Matrix</h1>
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
        <Divider />
      </div>
    );
  }
}

export default Metrics;
