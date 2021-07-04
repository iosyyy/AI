import React, { Component } from "react";
import { Table } from "antd";

export default class testTable extends Component {
  render() {
    const datasourceLength = 5;
    const TABLE_COLUMNS2 = [
      {
        title: "index",
        dataIndex: "index",
        key: "index",
        render: (text, row, index) => {
          return {
            children:
              index === datasourceLength ? <span>Total</span> : index + 1,
            props: {
              colSpan: index === datasourceLength ? 2 : 1,
            },
          };
        },
      },
      {
        title: "layer",
        dataIndex: "layer",
        key: "layer",
        render: (text, row, index) => {
          return {
            children: text,
            props: {
              colSpan: index === datasourceLength ? 0 : 1,
            },
          };
        },
      },
      {
        title: "original count",
        dataIndex: "originalCount",
        key: "originalCount",
      },
      {
        title: "train count",
        dataIndex: "trainCount",
        key: "trainCount",
      },
      {
        title: "validate count",
        dataIndex: "validateCount",
        key: "validateCount",
      },
      {
        title: "test count",
        dataIndex: "testCount",
        key: "testCount",
      },
    ];
    const dataSource = [
      {
        layer: 0,
        originalCount: 77,
        trainCount: 69,
        validateCount: 0,
        testCount: 8,
      },
      {
        layer: 1,
        originalCount: 150,
        trainCount: 135,
        validateCount: 0,
        testCount: 15,
      },
      {
        layer: 1,
        originalCount: 150,
        trainCount: 135,
        validateCount: 0,
        testCount: 15,
      },
      {
        layer: 1,
        originalCount: 150,
        trainCount: 135,
        validateCount: 0,
        testCount: 15,
      },
      {
        layer: 1,
        originalCount: 150,
        trainCount: 135,
        validateCount: 0,
        testCount: 15,
      },
      {
        originalCount: 227,
        trainCount: "204(1110%)",
        validateCount: "204(1110%)",
        testCount: "204(1110%)",
      },
    ];
    return (
      <div className='site-layout-content' style={{ height: "65vh" }}>
        <Table
          columns={TABLE_COLUMNS2}
          bordered={false}
          size={"small"}
          pagination={false}
          dataSource={dataSource}
        />
      </div>
    );
  }
}
