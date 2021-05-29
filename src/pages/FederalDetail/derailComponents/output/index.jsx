import React, { Component } from "react";
import { Input, Table } from "antd";
import axios from "axios";
import api from "../../../../config/api";
import { message } from "antd/es";
const { TextArea } = Input;

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
          title: <div>{v}</div>,
          dataIndex: v,
          key: this.generateUUID(),
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
      });
    });
  }

  generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  render() {
    const { loading, dataSource, columns } = this.state;

    return (
      <div
        style={{
          marginTop: "3vh",
          height: "60vh",
          overflow: "auto",
        }}
      >
        <Table
          loading={loading}
          scroll={{ y: "55vh" }}
          bordered={false}
          size={"middle"}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
}

export default FederalDetailOutput;
