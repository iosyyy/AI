import React, { Component } from "react";
import { Table, Select } from "antd";
import axios from "axios";
import api from "../../../../config/api";
import { message } from "antd/es";
import "./index.css";

class FederalDetailOutput extends Component {
  constructor(props) {
    super(props);
    const { post_data } = props;
    const columns = [];
    const dataSource1 = [];
    const dataSource2 = [];
    const dataSource3 = [];
    this.state = {
      columns,
      dataSource1,
      dataSource2,
      dataSource3,
      post_data,
      loading: true,
      total: 0,
      curOption: "train",
    };
  }

  componentDidMount() {
    console.log(this.props);
    const { post_data } = this.state;
    axios
      .post(api.data_output, post_data)
      .then(r => {
        console.log(r);
        if (r.data.code !== 0) {
          message.error(`${r.data.code}:${r.data.msg}`);
          return;
        }
        if (Object.keys(r.data.data).length === 0) {
          return;
        }
        let { data } = r.data;
        const { header } = data.meta;
        const columns = header[0].map((v, _i) => {
          return {
            title: v,
            dataIndex: v,
            key: v,
            align: "center",
            width: "9vw",
          };
        });
        let dataDeatil = data.data;
        const dataSource1 = dataDeatil[0].map((v, i) => {
          let obj = {};
          for (let key in v) {
            if (v.hasOwnProperty(key)) {
              obj[header[0][key]] = v[key];
              obj["key"] = i;
            }
          }
          obj["key"] = this.generateUUID();
          return obj;
        });
        const dataSource2 = dataDeatil[1].map((v, i) => {
          let obj = {};
          for (let key in v) {
            if (v.hasOwnProperty(key)) {
              obj[header[0][key]] = v[key];
              obj["key"] = i;
            }
          }
          obj["key"] = this.generateUUID();
          return obj;
        });
        const dataSource3 = dataDeatil[2].map((v, i) => {
          let obj = {};
          for (let key in v) {
            if (v.hasOwnProperty(key)) {
              obj[header[0][key]] = v[key];
              obj["key"] = i;
            }
          }
          obj["key"] = this.generateUUID();
          return obj;
        });
        this.setState({
          columns,
          dataSource1,
          dataSource2,
          dataSource3,
          loading: false,
          total: data.meta.total,
        });
      })
      .catch(() => {
        message.error("未知异常错误");
        this.setState({
          loading: false,
        });
      });
  }
  componentWillUnmount() {
    //处理逻辑
    this.setState = (state, callback) => {
      return;
    };
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
  handleChange = value => {
    this.setState({
      curOption: value,
    });
  };

  render() {
    const {
      loading,
      dataSource1,
      dataSource2,
      dataSource3,
      columns,
      total,
      curOption,
    } = this.state;
    const table1 =
      dataSource1.length !== 0 ? (
        <Table
          loading={loading}
          bordered={false}
          size={"middle"}
          dataSource={dataSource1}
          columns={columns}
          pagination={false}
        />
      ) : (
        <h1>
          <a>暂无数据</a>
        </h1>
      );
    const table2 =
      dataSource2.length !== 0 ? (
        <Table
          loading={loading}
          bordered={false}
          size={"middle"}
          dataSource={dataSource2}
          columns={columns}
          pagination={false}
        />
      ) : (
        <h1>
          <a>暂无数据</a>
        </h1>
      );
    const table3 =
      dataSource3.length !== 0 ? (
        <Table
          loading={loading}
          bordered={false}
          size={"middle"}
          dataSource={dataSource3}
          columns={columns}
          pagination={false}
        />
      ) : (
        <h1>
          <a>暂无数据</a>
        </h1>
      );

    return (
      <div style={{ height: "64vh" }} className='scrollContent'>
        <Select
          defaultValue='train'
          style={{ width: 120 }}
          onChange={this.handleChange}
        >
          <Select.Option value='train'>train</Select.Option>
          <Select.Option value='validate'>validate</Select.Option>
          <Select.Option value='test'>test</Select.Option>
        </Select>
        <div
          style={{
            fontSize: "small",
            color: "rgb(127,125,142)",
            marginBottom: "1vh",
          }}
        >
          {`Outputting ${total} instances (only 100 instances are shown in the table)`}
        </div>
        {curOption === "train"
          ? table1
          : curOption === "validate"
          ? table2
          : table3}
      </div>
    );
  }
}

export default FederalDetailOutput;
