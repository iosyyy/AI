import React, { Component } from "react";
import { Divider, Progress, Row, Select, Table } from "antd";
import axios from "axios";
import api from "../../../../config/api";
import PrecisionRecall from "./precisionRecall";
import Loss from "../../../../components/Loss";
import TreeGraph from "../../../../components/TreeGraph";

const { Column } = Table;
const colors = [
  ["rgb(50,100,250)", "rgb(10,200,60)"],
  ["rgb(36,150,237)", "rgb(198,107,164)"],
  ["rgb(229,192,123)", "rgb(152,195,121)"],
];

class BoostModelOutput extends Component {
  constructor(props) {
    super(props);
    let metricsKeys = Object.keys(props.metrics);
    const {
      trees,
      treeNum,
      treeDim,
      featureNameFidMapping,
      numClasses,
    } = props.model.data.data.data;
    this.state = {
      metricsKeys,
      maxFeature: 0,
      featureDatasouce: [],
      trees,
      treeNum,
      featureNameFidMapping,
      numClasses,
      index: 0,
      id: 0,
      treeDim,
    };
  }

  componentDidMount() {
    const { post_data } = this.props;
    let metricsKeys = Object.keys(this.props.metrics);

    if (post_data.role === "arbiter" || metricsKeys) {
      return;
    }
    let metricsForPerformanceScores = this.props.metrics[
      metricsKeys[0]
    ].filter((item) => item.match(/^iteration_([0-9]$)/g));

    // getPerformanceScoresDatasource
    let metrics = {};
    for (let key of metricsKeys) {
      metrics[key] = metricsForPerformanceScores;
    }
    let postData = { ...post_data, metrics };
    axios
      .post(api.batch, postData)
      .then((data) => {
        let performanceScoresDatasource = [];
        for (let key of metricsForPerformanceScores) {
          for (let metricsKey of metricsKeys) {
            let performanceScoresData = {};
            performanceScoresData.key = key + metricsKey;
            performanceScoresData.dataset = metricsKey;
            performanceScoresData.performanceScores = key;
            let trainData = data.data.data[metricsKey][key].data;
            trainData.forEach(
              (item) => (performanceScoresData[item[0]] = item[1])
            );

            performanceScoresDatasource.push(performanceScoresData);
          }
        }
        this.setState({ performanceScoresDatasource });
      })
      .catch((e) => {
        console.error(e);
      });

    // getFeatureSourceDatasource
    let featureDatasource = this.props.model.data.data.data.featureImportances.map(
      (item, index) => ({
        key: index,
        featureName: item.fullname,
        value: item.fid,
      })
    );
    let maxFeature = -1;
    featureDatasource.forEach((item) => {
      if (item.value > maxFeature) maxFeature = item.value;
    });

    this.setState({
      metricsForPerformanceScores,
      trainKey: metricsKeys,
      maxFeature,
      featureDatasource,
    });
  }

  render() {
    const { post_data } = this.props;
    const {
      treeNum,
      treeDim,
      trees,
      index,
      id,
      featureNameFidMapping,
      numClasses,
    } = this.state;

    const treeSelect = new Array(treeNum).fill("").map((_v, i) => {
      return (
        <Select.Option key={i} v={i}>
          {i}
        </Select.Option>
      );
    });
    const indexSelect = new Array(treeDim).fill("").map((_v, i) => {
      return (
        <Select.Option key={i} v={i}>
          {i} : {i}
        </Select.Option>
      );
    });
    if (this.state.metricsKeys) {
      return (
        <div style={{ height: "64vh" }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", display: "block" }}>
            Tree
          </h1>
          <div
            style={{
              color: "rgb(127,125,142)",
              fontSize: "17px",
              fontWeight: "bold",
              lineHeight: "5vh",
            }}
          >
            <span
              style={{
                color: "rgb(127,125,142)",
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              Tree index:{" "}
            </span>
            <Select
              onChange={(e) => {
                this.setState({
                  index: Number(e),
                });
              }}
              defaultValue={"0 : 0"}
            >
              {indexSelect}
            </Select>
          </div>

          <div
            style={{
              color: "rgb(127,125,142)",
              fontSize: "17px",
              fontWeight: "bold",
              lineHeight: "5vh",
            }}
          >
            <span
              style={{
                color: "rgb(127,125,142)",
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              Tree ID:{" "}
            </span>

            <Select
              onChange={(e) => {
                this.setState({
                  id: Number(e),
                });
              }}
              defaultValue={0}
            >
              {treeSelect}
            </Select>

            <b> Tree Size: {trees[index * treeDim + id].tree.length}</b>
          </div>
          <div className={"scrollContent"} style={{ height: "64vh" }}>
            {/* 参数解释: colors[0]代表顶层颜色,colors[1]代表底层颜色,其他参数先写成固定为3个*/}
            <TreeGraph
              numClasses={numClasses}
              featureNameFidMapping={featureNameFidMapping}
              treeDim={treeDim}
              key={index * treeDim + id}
              colors={colors[index]}
              id={id}
              index={index}
              trees={trees}
            />
          </div>
        </div>
      );
    }
    if (post_data.role !== "arbiter") {
      const {
        maxFeature,
        featureDatasource,
        performanceScoresDatasource,
        metricsKeys,
        index,
        trees,
        id,
      } = this.state;
      return (
        <div style={{ height: "64vh" }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", display: "block" }}>
            Tree
          </h1>
          <div
            style={{
              color: "rgb(127,125,142)",
              fontSize: "17px",
              fontWeight: "bold",
              lineHeight: "5vh",
            }}
          >
            <span
              style={{
                color: "rgb(127,125,142)",
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              Tree index:{" "}
            </span>
            <Select
              onChange={(e) => {
                this.setState({
                  index: Number(e),
                });
              }}
              defaultValue={"0 : 0"}
            >
              {indexSelect}
            </Select>
          </div>

          <div
            style={{
              color: "rgb(127,125,142)",
              fontSize: "17px",
              fontWeight: "bold",
              lineHeight: "5vh",
            }}
          >
            <span
              style={{
                color: "rgb(127,125,142)",
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              Tree ID:{" "}
            </span>

            <Select
              onChange={(e) => {
                this.setState({
                  id: Number(e),
                });
              }}
              defaultValue={0}
            >
              {treeSelect}
            </Select>

            <b> Tree Size: {trees[index * treeDim + id].tree.length}</b>
          </div>
          <div className={"scrollContent"} style={{ height: "64vh" }}>
            {/* 参数解释: colors[0]代表顶层颜色,colors[1]代表底层颜色,其他参数先写成固定为3个*/}
            <TreeGraph
              numClasses={numClasses}
              featureNameFidMapping={featureNameFidMapping}
              treeDim={treeDim}
              key={index * treeDim + id}
              colors={colors[index]}
              id={id}
              index={index}
              trees={trees}
            />
          </div>
          <Divider />

          <h1 style={{ fontSize: 24, fontWeight: "bold", display: "block" }}>
            Performance scores
          </h1>
          <Table
            bordered="true"
            pagination={false}
            size="small"
            dataSource={performanceScoresDatasource}
          >
            <Column
              key="performanceScores"
              dataIndex="performanceScores"
              title=""
              width="15vw"
              render={(text, _record, index) => {
                let l = metricsKeys.length;

                if (index % l === 0) {
                  return {
                    children: text,
                    props: {
                      rowSpan: l,
                    },
                  };
                } else {
                  return {
                    children: text,
                    props: {
                      rowSpan: 0,
                    },
                  };
                }
              }}
            />
            <Column
              key="dataset"
              dataIndex="dataset"
              title="dataset"
              width="15vw"
            />
            <Column
              key="accuracy"
              dataIndex="accuracy"
              title="accuracy"
              width="15vw"
            />
            <Column
              key="precision"
              dataIndex="precision"
              title="precision"
              width="15vw"
            />
            <Column
              key="recall"
              dataIndex="recall"
              title="recall"
              width="15vw"
            />
          </Table>

          <Divider />

          <h1 style={{ fontSize: 24, fontWeight: "bold", display: "block" }}>
            Feature Importance
          </h1>

          <Table
            bordered="true"
            dataSource={featureDatasource}
            pagination={false}
            size="small"
          >
            <Column
              key="featureName"
              dataIndex="featureName"
              title="FEATURE"
              width="15vw"
            />
            <Column
              key="value"
              dataIndex="value"
              title=""
              render={(text, record) => {
                let per = (record.value / maxFeature) * 100;
                return (
                  <>
                    <Row>
                      <Progress
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                        showInfo={false}
                        percent={per}
                        style={{ width: "95%", marginRight: "2%" }}
                      />
                      <span>{record.value}</span>
                    </Row>
                  </>
                );
              }}
            />
          </Table>

          <Divider />
          <PrecisionRecall
            postData={post_data}
            allMetrics={this.props.metrics}
            metricsKeys={metricsKeys}
          />
        </div>
      );
    } else {
      return (
        <Loss post_data={post_data} metricsKeys={this.state.metricsKeys} />
      );
    }
  }
}

export default BoostModelOutput;
