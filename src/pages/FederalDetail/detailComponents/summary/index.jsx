import React, { Component } from "react";
import axios from "axios";
import api from "../../../../config/api";
import { message } from "antd/es";
import { Col, Row } from "antd";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const { metric_namespace, metric_name, post_data } = this.props;
    axios
      .post(api.metrics_data, {
        metric_namespace,
        metric_name,
        ...post_data,
      })
      .then((r) => {
        if (r.data.code !== 0) {
          message.error(`${r.data.code}:${r.data.msg}`);
          return;
        }
        if (Object.keys(r.data.data).length === 0) {
          return;
        }
        this.setState({ data: r.data.data.data });
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

  render() {
    const { data } = this.state;
    let dataDetail;
    if (data) {
      dataDetail = data.map((v, i) => {
        return (
          <div
            key={v[0] + i}
            style={{
              height: "65vh",
              marginBottom: "1vh",
              color: "rgb(127, 125, 142)",
            }}
          >
            {v[0] + ": " + v[1]}
          </div>
        );
      });
    } else {
      dataDetail = (
        <Row style={{ height: "62vh", marginTop: "2vh" }} justify={"center"}>
          <Col>
            <h1>There is no data</h1>
          </Col>
        </Row>
      );
    }
    return (
      <div className={"scrollContent"} style={{ height: "64vh" }}>
        {dataDetail}
      </div>
    );
  }
}

export default Summary;
