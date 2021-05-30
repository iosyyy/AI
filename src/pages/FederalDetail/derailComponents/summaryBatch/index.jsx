import React, { Component } from "react";
import axios from "axios";
import api from "../../../../config/api";
import { Col, message, Row, Table } from "antd";
import Search from "antd/es/input/Search";

class SummaryBatch extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>index</div>,
        dataIndex: "index",
        key: "index",
        align: "center",

        render: (index) => {
          return <div>{index}</div>;
        },
      },
      {
        title: <div>variable</div>,
        dataIndex: "variable",
        key: "variable",
        align: "center",
        sorter: {
          compare: (a, b) => {
            return a.variable > b.variable;
          },
        },
      },
      {
        title: <div>samples</div>,
        dataIndex: "samples",
        key: "samples",
        align: "center",
      },
    ];
    this.state = {
      data: {},
      columns,
      dataSource: [],
      dataSources: [],
    };
  }

  componentDidMount() {
    const { post_data, metrics } = this.props;
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
          const { reader_name } = r.data.data.reader_namespace;
          const tableInfo = reader_name.meta.table_info;
          let dataSource = [];
          let index = 1;
          for (let variable in tableInfo) {
            dataSource.push({
              index,
              variable,
              samples: tableInfo[variable],
            });
            index++;
          }
          this.setState({
            data: reader_name,
            dataSource,
            dataSources: dataSource,
          });
        });
    }
  }

  render() {
    const { post_data, metrics } = this.props;
    const { data, columns, dataSource, dataSources } = this.state;
    let dataDetail = [];
    if (Object.keys(data).length !== 0) {
      const names = data.meta;
      for (let key in names) {
        if (
          key !== "table_info" &&
          key !== "name" &&
          key !== "namespace" &&
          key !== "table_info" &&
          key !== "table_name"
        )
          dataDetail.push(
            <div
              style={{
                fontSize: "small",
                fontWeight: 10,
                marginBottom: "1vh",
                color: "rgb(127, 125, 142)",
              }}
            >
              {`${key}: ${names[key]}`}
            </div>
          );
      }
    }
    if (Object.keys(metrics).length === 0) {
      return (
        <Row style={{ marginTop: "2vh", height: "63vh" }} justify={"center"}>
          <Col>
            <h1>There is no data</h1>
          </Col>
        </Row>
      );
    } else {
      return (
        <div style={{ height: "80vh", overflow: "auto" }}>
          <div>{dataDetail}</div>
          <Search
            onSearch={(value) => {
              let datas = dataSources.filter((data) => {
                return data.variable
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase());
              });
              this.setState({
                dataSource: datas,
              });
            }}
            style={{ float: "right", width: "20vh" }}
          />
          <Table
            style={{ marginTop: "2vh" }}
            pagination={false}
            size={"middle"}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      );
    }
  }
}

export default SummaryBatch;
