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
    console.log(post_data);
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
        this.setState({ data: r.data.data.data });
      });
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
        <Row style={{ height: "65vh", marginTop: "2vh" }} justify={"center"}>
          <Col>
            <h1>There is no data</h1>
          </Col>
        </Row>
      );
    }
    return <div style={{ height: "65vh" }}>{dataDetail}</div>;
  }
}

export default Summary;
