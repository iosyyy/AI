import React, { Component } from "react";
import { Col, Row, Table, Divider } from "antd";
import Loss from "../../../../components/Loss";

class ModelOutput extends Component {
  constructor(props) {
    super(props);
    console.log(props.model.data.data.data);
    let iterations = props.model.data.data.data.iters;
    let isConverged = props.model.data.data.data.isConverged;
    let weight = props.model.data.data.data.weight;
    let dataSource = [];
    let index = 0;
    for (let key in weight) {
      index = (index % 10) + 1;
      dataSource.push({
        key: key,
        index: index,
        variable: key,
        weight: weight[key],
      });
    }
    this.state = {
      iterations,
      isConverged,
      dataSource,
    };
  }

  componentDidMount() {}

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
    return (
      <div className={"scrollContent"} style={{ height: "60vh" }}>
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

        <Loss lossHistory={this.props.model.data.data.data.lossHistory} />
      </div>
    );
  }
}

export default ModelOutput;
