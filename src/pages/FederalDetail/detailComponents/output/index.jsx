import React, { Component } from "react";
import { Table, Select, Col, Row, Tooltip } from "antd";
import axios from "axios";
import api from "../../../../config/api";
import { message } from "antd/es";
import "./index.css";

class FederalDetailOutput extends Component {
  constructor(props) {
    super(props);
    const { post_data } = props;
    const columns = [[]];
    this.state = {
      columns,
      dataSources: [[]],
      post_data,
      loading: true,
      total: 0,
      curOption: 0,
      names: [],
    };
  }

  componentDidMount() {
    const { post_data } = this.state;
    axios
      .post(api.data_output, post_data)
      .then((r) => {
        if (r.data.code !== 0) {
          message.error(`${r.data.code}:${r.data.msg}`);
          return;
        }
        if (Object.keys(r.data.data).length === 0) {
          return;
        }
        let { data } = r.data;
        const { header, names } = data.meta;
        const columns = [];
        for (let head of header) {
          let column;
          if (head) {
            column = head.map((v, _i) => {
              return {
                title: v,
                dataIndex: v,
                key: v,
                align: "center",
                width: "9vw",
                render: (value, obj) => {
                  if (value.length >= 30) {
                    return (
                      <Tooltip color="rgb(175,178,173)" title={value}>
                        <span>{value.substring(0, 30)}</span>
                        <span
                          style={{
                            color: "rgb(127,125,142)",
                            fontSize: "small",
                          }}
                        >
                          ···
                        </span>
                      </Tooltip>
                    );
                  } else {
                    return value;
                  }
                },
              };
            });
          } else {
            column = [];
          }
          columns.push(column);
        }

        let dataDeatil = data.data;
        const dataSources = [];
        for (let datas of dataDeatil) {
          const dataSource = datas.map((v, i) => {
            let obj = {};
            for (let key in v) {
              if (v.hasOwnProperty(key)) {
                const data = v[key];
                if (isNaN(data) && typeof data !== "string") {
                  obj[header[0][key]] = JSON.stringify(data);
                } else {
                  obj[header[0][key]] = data;
                }
              }
            }
            obj["key"] = this.generateUUID();
            return obj;
          });
          dataSources.push(dataSource);
        }
        this.setState({
          columns,
          dataSources,
          loading: false,
          total: data.meta.total,
          names,
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
  handleChange = (value) => {
    this.setState({
      curOption: value,
    });
  };

  render() {
    const {
      loading,
      dataSources,
      columns,
      total,
      curOption,
      names,
    } = this.state;
    return (
      <div style={{ height: "64vh" }} className="scrollContent">
        <Select
          defaultValue={0}
          style={{ width: 120 }}
          onChange={this.handleChange}
        >
          {names.map((v, i) => {
            return (
              <Select.Option key={i} value={i}>
                {v}
              </Select.Option>
            );
          })}
        </Select>
        <div
          style={{
            fontSize: "small",
            color: "rgb(127,125,142)",
            marginBottom: "1vh",
          }}
        >
          {`Outputting ${total[curOption]} instances (only 100 instances are shown in the table)`}
        </div>
        {dataSources[curOption] &&
        dataSources[curOption].length !== 0 &&
        !loading ? (
          <Table
            empty={true}
            loading={loading}
            bordered={false}
            size={"middle"}
            dataSource={dataSources[curOption]}
            columns={columns[curOption]}
            pagination={false}
          />
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

export default FederalDetailOutput;
