import React, { Component } from "react";
import { Col, Divider, InputNumber, Row, Slider, Table } from "antd";
import axios from "axios";
import api from "../../../../config/api";

const { Column, ColumnGroup } = Table;

class Metrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue1: 0.5,
      inputValue2: 0.5,
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
        console.log(r.data);
        // 页面数据
      });
  }

  onChange1 = (value) => {
    this.setState({
      inputValue1: value,
    });
  };

  onChange2 = (value) => {
    this.setState({
      inputValue2: value,
    });
  };

  render() {
    const { inputValue1, inputValue2 } = this.state;
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
        <Divider></Divider>

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
        <Divider></Divider>
      </div>
    );
  }
}

export default Metrics;
