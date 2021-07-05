import React, { Component } from "react";
import { message, Table } from "antd";
import axios from "axios";
import api from "../../../../config/api";

export default class SummaryBatchDataSplit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TABLE_COLUMNS2: [],
      loading: true,
    };
  }

  componentDidMount() {
    const { post_data, metrics } = this.props;
    post_data.metrics = metrics;
    let keyName = Object.keys(metrics)[0];
    let train = metrics[keyName];
    if (Object.keys(metrics).length !== 0) {
      axios
        .post(api.batch, {
          ...post_data,
          metrics,
        })
        .then((r) => {
          if (r.data.code !== 0) {
            message.error(`${r.data.code}:${r.data.msg}`);
            return;
          }
          const { meta } = r.data.data.train.data_split;
          const {
            label_names,
            original,
            test,
            train,
            validate,
          } = meta.data_split_label_info;
          const originalCount = meta.data_split_count_info.original;
          const testCount = meta.data_split_count_info.test;
          const trainCount = meta.data_split_count_info.train;
          const validateCount = meta.data_split_count_info.validate;
          const trainRatio = meta.data_split_ratio_info.train;
          const testRatio = meta.data_split_ratio_info.test;
          const validateRatio = meta.data_split_ratio_info.validate;

          const dataSource = label_names.map((v, i) => {
            return {
              key: this.generateUUID() + v,
              layer: v,
              originalCount: original[i],
              trainCount: train[i],
              validateCount: validate[i],
              testCount: test[i],
            };
          });
          dataSource.push({
            originalCount: originalCount,
            trainCount: `${trainCount}(${(trainRatio * 100).toFixed(4)}%)`,
            validateCount: `${validateCount}(${(validateRatio * 100).toFixed(
              4
            )}%)`,
            testCount: `${testCount}(${(testRatio * 100).toFixed(4)}%)`,
          });
          const TABLE_COLUMNS2 = [
            {
              title: "index",
              dataIndex: "index",
              key: "index",
              align: "center",
              render: (text, row, index) => {
                return {
                  children:
                    index === dataSource.length - 1 ? (
                      <div
                        style={{
                          height: "100%",
                          width: "100%",
                          textAlign: "center",
                          fontWeight: "bolder",
                        }}
                      >
                        Total
                      </div>
                    ) : (
                      index + 1
                    ),
                  props: {
                    colSpan: index === dataSource.length - 1 ? 2 : 1,
                  },
                };
              },
            },
            {
              title: "layer",
              dataIndex: "layer",
              key: "layer",
              align: "center",

              render: (text, row, index) => {
                return {
                  children: text,
                  props: {
                    colSpan: index === dataSource.length - 1 ? 0 : 1,
                  },
                };
              },
            },
            {
              title: "original count",
              dataIndex: "originalCount",
              key: "originalCount",
              align: "center",
              render: (text) => {
                return (
                  <span style={{ color: "rgb(148,191,233)" }}>{text}</span>
                );
              },
            },
            {
              title: "train count",
              dataIndex: "trainCount",
              key: "trainCount",
              align: "center",
              render: (text) => {
                return (
                  <span style={{ color: "rgb(148,191,233)" }}>{text}</span>
                );
              },
            },
            {
              title: "validate count",
              dataIndex: "validateCount",
              key: "validateCount",
              align: "center",
              render: (text) => {
                return (
                  <span style={{ color: "rgb(148,191,233)" }}>{text}</span>
                );
              },
            },
            {
              title: "test count",
              dataIndex: "testCount",
              key: "testCount",
              align: "center",
              render: (text) => {
                return (
                  <span style={{ color: "rgb(148,191,233)" }}>{text}</span>
                );
              },
            },
          ];
          this.setState({
            loading: false,
            TABLE_COLUMNS2,
            dataSource,
          });
        })
        .catch(() => {
          message.error("未知异常错误");
          this.setState({
            loading: false,
          });
        });
    }
  }

  generateUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  render() {
    const { dataSource, TABLE_COLUMNS2 } = this.state;
    return (
      <div className={"scrollContent"} style={{ height: "64vh" }}>
        <Table
          columns={TABLE_COLUMNS2}
          bordered={false}
          pagination={false}
          dataSource={dataSource}
        />
      </div>
    );
  }
}
