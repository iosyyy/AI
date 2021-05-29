import React, { Component } from "react";
import { Button, Col, Row, Space, Tabs } from "antd";
import "./change.css";
import axios from "axios";
import api from "../../../config/api";
import federalDetailOutput from "../derailComponents/output";
import FederalDetailOutput from "../derailComponents/output";
import Summary from "../derailComponents/summary";
import Log from "../derailComponents/log";
import PubSubJS from "pubsub-js";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

class FederalDetailShow extends Component {
  constructor(props) {
    super(props);
    const { name, id, partyId, role } = this.props.location.state;
    this.state = {
      change: 0,
      name,
      id,
      partyId,
      role,
      metric_namespace: "",
      names: [],
      loading: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    PubSubJS.publish("isRunning", { page: "-1" });
    this.refresh();
  }

  refresh = () => {
    this.setState({ isLoading: true });

    const { id, name, partyId, role, loading } = this.state;
    let data = {};
    let post_data = {
      component_name: name,
      job_id: id,
      party_id: partyId,
      role: role,
    };
    axios.post(api.getJobOutput, post_data).then((r) => {});
    axios.post(api.metrics, post_data).then((r) => {
      data = r.data.data;
      const metric_name = Object.values(data)[0][0];
      const metric_namespace = Object.keys(data)[0];

      this.setState({
        metric_namespace,
      });
      if (metric_namespace === "upload") {
        axios
          .post(api.metrics_data, {
            metric_namespace,
            metric_name,
            ...post_data,
          })
          .then((r) => {
            let names = [];
            names = [
              {
                name: "summary",
                component: <Summary data={r.data.data.data} />,
              },
              {
                name: "data output",
                component: (
                  <FederalDetailOutput key={loading} post_data={post_data} />
                ),
              },
              { name: "log", component: <Log post_data={post_data} /> },
            ];
            this.setState({ names });
          });
      }
    });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1500);
  };

  render() {
    const { name, metric_namespace, names, isLoading } = this.state;
    return (
      <div className="site-layout-content">
        <Row justify={"space-between"}>
          <Col>
            <h1>{metric_namespace + ":  " + name}</h1>
          </Col>
          <Col>
            <Button
              onClick={this.refresh}
              icon={<Loading3QuartersOutlined />}
              style={{ height: "10px" }}
              type={"text"}
            >
              刷新
            </Button>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1">
          {names.map((v, i) => {
            return (
              <TabPane tab={v.name} key={i}>
                {v.component}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default FederalDetailShow;
