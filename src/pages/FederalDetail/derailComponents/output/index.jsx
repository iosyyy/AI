import React, { Component } from "react";
import { Input, Table } from "antd";
import axios from "axios";
import api from "../../../../config/api";
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
      let { data } = r.data;
      const { header } = data.meta;
      const columns = header[0].map((v, i) => {
        return {
          title: <div>{v}</div>,
          dataIndex: v,
          key: v,
          align: "center",
          width: "9vw",
        };
      });
      let dataDeatil = data.data;
      const dataSource = dataDeatil[0].map((v, i) => {
        let obj = {};
        console.log(v);
        for (let key in v) {
          obj[header[0][key]] = v[key];
        }
        return obj;
      });
      console.log(dataSource);
      this.setState({
        columns,
        dataSource,
        loading: false,
      });
    });
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
