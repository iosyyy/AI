import React, { Component } from "react";
import { Table } from "antd";
import axios from "axios";
import api from "../../../../config/api";
import { message } from "antd/es";

class FederalDetailOutput extends Component {
  constructor(props) {
    super(props);
    const { post_data } = props;
    const columns = [];
    const dataSource = [];
    this.state = {
      columns,
      dataSource,
      post_data,
      loading: true,
      total: 0,
    };
  }

  componentDidMount() {
    const { post_data } = this.state;
    axios.post(api.data_output, post_data).then((r) => {
      if (r.data.code !== 0) {
        message.error(`${r.data.code}:${r.data.msg}`);
        return;
      }
      let { data } = r.data;
      const { header } = data.meta;
      const columns = header[0].map((v, i) => {
        return {
          title: v,
          dataIndex: v,
          key: this.generateUUID() + " " + Date.now(),
          align: "center",
          width: "9vw",
        };
      });
      let dataDeatil = data.data;
      const dataSource = dataDeatil[0].map((v, i) => {
        let obj = {};
        for (let key in v) {
          obj[header[0][key]] = v[key];
        }
        return obj;
      });
      this.setState({
        columns,
        dataSource,
        loading: false,
        total: data.meta.total,
      });
    });
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
    const { loading, dataSource, columns, total } = this.state;

    return (
      <div
        style={{
          height: "65vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            fontSize: "small",
            color: "rgb(127,125,142)",
            marginBottom: "1vh",
          }}
        >
          {`Outputting ${total} instances (only 100 instances are shown in the table)`}
        </div>
        <Table
          loading={loading}
          scroll={{ y: "55vh" }}
          bordered={false}
          size={"middle"}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default FederalDetailOutput;
