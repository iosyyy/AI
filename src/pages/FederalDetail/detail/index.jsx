import React, { Component } from "react";
import { Button, Col, Image, Row, Spin, Tabs } from "antd";
import "./change.css";
import axios from "axios";
import api from "../../../config/api";
import FederalDetailOutput from "../detailComponents/output";
import Summary from "../detailComponents/summary";
import Log from "../detailComponents/log";
import PubSubJS from "pubsub-js";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import Metrics from "../detailComponents/metrics";
import { message } from "antd/es";
import ModelOutput from "../detailComponents/modelOutput";
import SummaryBatch from "../detailComponents/summaryBatch";
import qs from "qs";
import SummaryBatchDataSplit from "../detailComponents/summaryDataSplit";
import returns from "../../../img/return.png";
const { TabPane } = Tabs;

class FederalDetailShow extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const cur = qs.parse(search.replace(/^\?/, ""));

    const { name, id, partyId, role, module } = cur;
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
      module,
    };
  }

  componentDidMount() {
    // 向主页面发送数据让其知道当前所在的page
    PubSubJS.publish("isRunning", { page: "-1" });
    this.refresh();
  }

  generateUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  refresh = () => {
    this.setState({ isLoading: true });

    const { id, name, partyId, role, module } = this.state;
    let data = {};
    let post_data = {
      component_name: name,
      job_id: id,
      party_id: partyId,
      role: role,
    };
    let namew = module;
    this.setState({
      metric_namespace: namew,
    });
    // 首先获取Model(api.getJobOutput)再获取Metrics(api.metrics),然后每个tab执行不同的操作
    axios
      .post(api.getJobOutput, post_data)
      .then((r) => {
        if (r.data.code !== 0) {
          message.error(`${r.data.code}:${r.data.msg}`);
          return;
        }
        if (Object.keys(r.data.data).length === 0) {
          this.setState({
            isLoading: false,
          });
          return;
        }
        const model = r;
        // 获取Metrics
        axios
          .post(api.metrics, post_data)
          .then((r) => {
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
              case "HomoDataSplit":
                names = [
                  {
                    name: "summary",
                    component: (
                      <SummaryBatchDataSplit
                        key={this.generateUUID()}
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
                      <FederalDetailOutput
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                  {
                    name: "log",
                    component: (
                      <Log
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                ];
                break;
              case "Upload":
                names = [
                  {
                    name: "summary",
                    component: (
                      <Summary
                        key={this.generateUUID()}
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
                      <FederalDetailOutput
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                  {
                    name: "log",
                    component: (
                      <Log
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                ];
                break;
              case "Evaluation":
                names = [
                  {
                    name: "metrics",
                    component: (
                      <Metrics
                        key={this.generateUUID()}
                        model={model}
                        metrics={metrics}
                        post_data={post_data}
                      />
                    ),
                  },
                  {
                    name: "log",
                    component: (
                      <Log
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                ];
                break;
              case "HomoLR":
                names = [
                  {
                    name: "model output",
                    component: (
                      <ModelOutput
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                        metrics={metrics}
                      />
                    ),
                  },
                  {
                    name: "data output",
                    component: (
                      <FederalDetailOutput
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                  {
                    name: "log",
                    component: (
                      <Log
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                ];
                break;
              case "Reader":
                names = [
                  {
                    name: "summary",
                    component: (
                      <SummaryBatch
                        key={this.generateUUID()}
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
                      <FederalDetailOutput
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                  {
                    name: "log",
                    component: (
                      <Log
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                ];
                break;
              default:
                names = [
                  {
                    name: "summary",
                    component: (
                      <SummaryBatch
                        key={this.generateUUID()}
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
                      <FederalDetailOutput
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                  {
                    name: "log",
                    component: (
                      <Log
                        key={this.generateUUID()}
                        model={model}
                        post_data={post_data}
                      />
                    ),
                  },
                ];
                break;
            }
            this.setState({ names });
            setTimeout(() => {
              this.setState({ isLoading: false });
            }, 500);
          })
          .catch(() => {
            setTimeout(() => {
              this.setState({ isLoading: false });
            }, 500);
          });
      })
      .catch(() => {
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 500);
      });
  };

  render() {
    const { name, metric_namespace, names, isLoading } = this.state;
    return (
      <div className="site-layout-content">
        <Spin spinning={isLoading}>
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
                disabled={isLoading}
              >
                刷新
              </Button>
              {/*<Button type="link">*/}
              {/*  <Image width={15} height={15} src={returns} preview={false} />*/}
              {/*</Button>*/}
            </Col>
          </Row>
          <Tabs disabled={isLoading} defaultActiveKey="1">
            {names.map((v, i) => {
              return (
                <TabPane tab={v.name} key={i}>
                  {v.component}
                </TabPane>
              );
            })}
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default FederalDetailShow;
