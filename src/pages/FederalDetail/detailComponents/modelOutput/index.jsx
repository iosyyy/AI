import React, { Component } from "react";
import { Col, Row, Table, Divider } from "antd";
import Loss from "../../../../components/Loss";

class ModelOutput extends Component {
  constructor(props) {
    super(props);
    let iterations = props.model.data.data.data.iters;
    let isConverged = props.model.data.data.data.isConverged;
    let weight = props.model.data.data.data.weight;
    let dataSource = [];
    let index = 0;
    for (let key in weight) {
      if (weight.hasOwnProperty(key)) {
        index = (index % 10) + 1;
        dataSource.push({
          key: key,
          index: index,
          variable: key,
          weight: weight[key],
        });
      }
    }
    this.state = {
      iterations,
      isConverged,
      dataSource,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    //处理逻辑
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const TABLE_COLUMNS = [
      {
        title: "index",
        dataIndex: "index",
        key: "index",
        with: "300",
      },
      {
        title: "variable",
        dataIndex: "variable",
        key: "variable",
        with: "150",
      },
      {
        title: "weight",
        dataIndex: "weight",
        key: "weight",
      },
    ];
    const data = this.props.model.data.data.data;
    return (
      <div className={"scrollContent"} style={{ height: "64vh" }}>
        {data && Object.keys(data).length !== 0 ? (
          <>
            <Row>
              <font style={{ color: "rgb(127,125,142)", fontSize: "small" }}>
                iterations: {this.state.iterations}
              </font>
            </Row>
            <Row>
              <Col>
                <font style={{ color: "rgb(127,125,142)", fontSize: "small" }}>
                  converged: {this.state.isConverged ? "true" : "false"}
                </font>
              </Col>
            </Row>
            <Table
              columns={TABLE_COLUMNS}
              dataSource={this.state.dataSource}
              size="small"
              pagination={{ pageSize: 10 }}
            />
            <Divider />
            {data.lossHistory && data.lossHistory.length !== 0 ? (
              <Loss lossHistory={data.lossHistory} />
            ) : (
              <></>
            )}
          </>
        ) : (
          <Row style={{ marginTop: "2vh", height: "62vh" }} justify={"center"}>
            <Col>
              <h1>There is no data</h1>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default ModelOutput;
