import React, { Component } from "react";
import { Button, Col, Row, Tabs } from "antd";
import "./change.css";
import axios from "axios";
import api from "../../../config/api";
import FederalDetailOutput from "../derailComponents/output";
import Summary from "../derailComponents/summary";
import Log from "../derailComponents/log";
import PubSubJS from "pubsub-js";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import Metrics from "../derailComponents/metrics";
import { message } from "antd/es";
import ModelOutput from "../derailComponents/modelOutput";
import SummaryBatch from "../derailComponents/summaryBatch";

const { TabPane } = Tabs;

class FederalDetailShow extends Component {
  constructor(props) {
    super(props);
    const { name, id, partyId, role, treeData } = this.props.location.state;
    /**
     * @param isLoading 代表是否正在刷新的状态
     * @param role,id,partyId,role 代表所需的post_data的基本属性
     * @param change 代表当前选择的tab
     * @param names 代表tabs的属性其中name代表tab的名称,component代表tab对应的组件
     * @param isLoading 判断当前是否被刷新如果刷新重新执行refresh操作
     * @type {{isLoading: boolean, role, names: *[], change: number, name, metric_namespace: string, id, partyId, loading: *[]}}
     */
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
      treeData,
    };
  }

  componentDidMount() {
    // 向主页面发送数据让其知道当前所在的page
    PubSubJS.publish("isRunning", { page: "-1" });
    this.refresh();
  }

  refresh = () => {
    this.setState({ isLoading: true });

    const { id, name, partyId, role, treeData } = this.state;
    let data = {};
    let post_data = {
      component_name: name,
      job_id: id,
      party_id: partyId,
      role: role,
    };
    let namew = treeData.module;
    this.setState({
      metric_namespace: namew,
    });
    // 首先获取Model(api.getJobOutput)再获取Metrics(api.metrics),然后每个tab执行不同的操作
    axios.post(api.getJobOutput, post_data).then((r) => {
      if (r.data.code !== 0) {
        message.error(`${r.data.code}:${r.data.msg}`);
        return;
      }
      const model = r;
      // 获取Metrics
      axios.post(api.metrics, post_data).then((r) => {
        if (r.data.code !== 0) {
          message.error(`${r.data.code}:${r.data.msg}`);
          return;
        }

        data = r.data.data;
        let metrics = r.data.data;
        let metric_name, metric_namespace; // 这两个名字用来定义左上角的名字,并且通过这两个名字定义不同的tabs

        if (
          !metric_name &&
          !metric_namespace &&
          Object.keys(data).length !== 0
        ) {
          metric_name = Object.values(data)[0][0];
          metric_namespace = Object.keys(data)[0];
        }

        let names; // names中的name代表tab的标题,component代表tab对应的组件
        /**
         * props解释
         * post_data代表所传axios所需要的基本参数有job_id,party_id,role,component_name
         * metric_name代表上面说到的名字,metric_namespace上面也有提到
         * metrics代表api.metrics返回的data数据
         */
        switch (namew) {
          // 这里通过metric_namespace选择不同的tabs
          case "Upload":
            names = [
              {
                name: "summary",
                component: (
                  <Summary
                    model={model}
                    post_data={post_data}
                    metric_name={metric_name}
                    metric_namespace={metric_namespace}
                  />
                ),
              },
              {
                name: "data output",
                component: (
                  <FederalDetailOutput model={model} post_data={post_data} />
                ),
              },
              {
                name: "log",
                component: <Log model={model} post_data={post_data} />,
              },
            ];
            break;
          case "Evaluation":
            names = [
              {
                name: "metrics",
                component: (
                  <Metrics
                    model={model}
                    metrics={metrics}
                    post_data={post_data}
                  />
                ),
              },
              {
                name: "log",
                component: <Log model={model} post_data={post_data} />,
              },
            ];
            break;
          case "HomoLR":
            names = [
              {
                name: "model output",
                component: (
                  <ModelOutput
                    model={model}
                    post_data={post_data}
                    metrics={metrics}
                  />
                ),
              },
              {
                name: "data output",
                component: (
                  <FederalDetailOutput model={model} post_data={post_data} />
                ),
              },
              {
                name: "log",
                component: <Log model={model} post_data={post_data} />,
              },
            ];
            break;
          case "Reader":
            names = [
              {
                name: "summary",
                component: (
                  <SummaryBatch
                    metric_name={metric_name}
                    metric_namespace={metric_namespace}
                    model={model}
                    post_data={post_data}
                    metrics={metrics}
                  />
                ),
              },
              {
                name: "data output",
                component: (
                  <FederalDetailOutput model={model} post_data={post_data} />
                ),
              },
              {
                name: "log",
                component: <Log model={model} post_data={post_data} />,
              },
            ];
            break;
          case "DataIO":
          case "FeatureScale":
            names = [
              {
                name: "summary",
                component: (
                  <SummaryBatch
                    metric_name={metric_name}
                    metric_namespace={metric_namespace}
                    model={model}
                    post_data={post_data}
                    metrics={metrics}
                  />
                ),
              },
              {
                name: "data output",
                component: (
                  <FederalDetailOutput model={model} post_data={post_data} />
                ),
              },
              {
                name: "log",
                component: <Log model={model} post_data={post_data} />,
              },
            ];
            break;
        }
        this.setState({ names });
      });
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
              loading={isLoading}
              onClick={this.refresh}
              icon={<Loading3QuartersOutlined />}
              style={{ height: "10px" }}
              type={"link"}
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
