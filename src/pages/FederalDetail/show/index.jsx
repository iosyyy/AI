import React, { Component } from "react";
import { Button, Col, message, Row, Spin, Tree } from "antd";
import Show from "../../../components/Show";
import api from "../../../config/api";
import dayjs from "dayjs";
import axios from "axios";
import PubSubJS from "pubsub-js";
import qs from "qs";
import MainGraph from "../../../components/MainGraph";
import { fontStyle } from "../../../util/util";

class FederalDetail extends Component {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const cur = qs.parse(search.replace(/^\?/, ""));
    const startTime = new Date(Number(cur.startTime)).toLocaleString();
    const endTime = new Date(Number(cur.endTime)).toLocaleString();
    const duration = cur.duration / 1000;
    this.state = {
      id: cur.id,
      role: cur.role,
      partyId: cur.partyId,
      status: cur.status,
      type: cur.workmode,
      startTime,
      endTime,
      description: "",
      name: "",
      dataset: [],
      dataSetRole: [],
      dataSetPartyID: [],
      duration: `${duration}秒`,
      names: [],
      treeData: [],
      d: {},
      loading: true,
      dataIndex: "",
      datas: [],
      component_list: [],
      isLoading: false,
      key: this.generateUUID(),
      dependencies: {},
      component_need_run: {},
    };
  }

  onChange = (index) => {
    this.setState({
      loading: true,
      isLoading: false,
      dataIndex: index,
    });
    axios
      .post(api.showDetailParameters, {
        component_name: index,
        job_id: this.state.id,
        party_id: this.state.partyId,
        role: this.state.role,
      })
      .then((data) => {
        let d = JSON.parse(data.data.data);
        let treeData;
        treeData = this.getDeatilList([], d);
        if (!d || Object.keys(d).length === 0) {
          d = [{ title: "No Dates", key: "No Dates" }];
          this.setState({ datas: d, loading: true, isLoading: false });
          return;
        }
        this.setState({ datas: d, treeData, loading: false, isLoading: true });
      })
      .catch((_m) => {
        message.error("服务器异常");
        this.setState({
          loading: false,
          isLoading: true,
        });
      });
  };

  componentWillUnmount() {
    //处理逻辑
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
  getDeatilList(data, treeData) {
    for (let treeDataKey in treeData) {
      if (treeData.hasOwnProperty(treeDataKey)) {
        let child = [];
        if (typeof treeData[treeDataKey] === "object") {
          if (treeData[treeDataKey] !== null) {
            this.getDeatilList(child, treeData[treeDataKey]);
            data.push({
              title: `${treeDataKey}`,
              key: `${this.generateUUID().replace("-", "")}`,
              children: child,
            });
          } else {
            data.push({
              title: `${treeDataKey}:  ${treeData[treeDataKey]}`,
              key: `${this.generateUUID().replace("-", "")}`,
            });
          }
        } else {
          data.push({
            title: `${treeDataKey}:  ${treeData[treeDataKey]}`,
            key: `${this.generateUUID().replace("-", "")}`,
          });
        }
      } else {
      }
    }
    return data;
  }

  getShowList(jobId, role, partyId) {
    const url = api.showList
      .replace("{jobId}", jobId)
      .replace("{role}", role)
      .replace("{partyId}", partyId);
    const socket = new WebSocket(url);

    socket.onmessage = (data) => {
      const d = JSON.parse(data.data);
      const {
        component_list,
        dependencies,
        component_need_run,
      } = d.dependency_data;
      const names = component_list.map((item) => item.component_name);
      let change = false;
      for (const item in component_list) {
        if (
          (component_list.hasOwnProperty(item) &&
            this.state.component_list.length === 0) ||
          component_list[item].status !== this.state.component_list[item]
        ) {
          change = true;
          break;
        }
      }

      const { job } = d.summary_date;

      const datasets = [];
      const dataSetPartyID = [];
      const dataSetRole = [];
      const dataset = d.summary_date.dataset.dataset;
      for (let data in dataset) {
        if (dataset.hasOwnProperty(data)) {
          for (let partyId in dataset[data]) {
            if (dataset[data].hasOwnProperty(partyId)) {
              const values = Object.values(dataset[data][partyId]);
              for (let value of values) {
                const vals = value.split(".");
                if (vals && vals.length > 0) {
                  datasets.push(vals[1]);
                } else {
                  datasets.push(vals);
                }

                dataSetPartyID.push(partyId);
                dataSetRole.push(data);
              }
            }
          }
        }
      }
      this.setState({
        names,
        component_list,
        key: this.generateUUID(),
        dependencies,
        component_need_run,
        id: job.fJobId,
        role: job.fRole,
        partyId: job.fPartyId,
        status: job.fStatus,
        type: job.fWorkMode === 0 ? "单机训练" : "联合训练",
        startTime: new Date(Number(job.fStartTime)).toLocaleString(),
        endTime: new Date(Number(job.fEndTime)).toLocaleString(),
        duration: `${d.duration / 1000}秒`,
        dataset: datasets,
        dataSetRole: dataSetRole,
        dataSetPartyID: dataSetPartyID,
        name: job.fName,
        description: job.fDescription,
      });
    };
  }

  componentDidMount() {
    PubSubJS.publish("isRunning", { page: "-1" });
    this.getShowList(this.state.id, this.state.role, this.state.partyId);
  }

  render() {
    const {
      id,
      role,
      partyId,
      component_list,
      names,
      key,
      dependencies,
      component_need_run,
    } = this.state;

    return (
      <div
        className="site-layout-content"
        style={{ height: "83vh", width: "100%" }}
      >
        <div
          style={{
            display: "inline-block",
            width: "20%",
            height: "75vh",
            overflow: "auto",
          }}
        >
          <div
            style={{
              marginRight: "1vh",
              borderBottom: "1px solid",
            }}
          >
            <h1 style={{ ...fontStyle }}>任务摘要</h1>
            <div style={{ marginTop: "4vh", ...fontStyle }}>任务ID:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.id}</div>
            <div style={{ ...fontStyle }}>任务名称:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.name}</div>
            <div style={{ ...fontStyle }}>状态:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.status}</div>
            <div style={{ ...fontStyle }}>类型:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.type}</div>
            <div style={{ ...fontStyle }}>任务描述:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.description}</div>
          </div>
          <div
            style={{
              paddingTop: "1vh",
              paddingBottom: "1vh",
              paddingRight: "2vw",
              marginRight: "1vh",
              borderBottom: "1px solid",
            }}
          >
            {this.state.dataset.map((v, i) => {
              return (
                <div style={{ marginRight: "1vw" }}>
                  <Row justify={"space-between"}>
                    <Col>role:</Col>
                    <Col style={{ ...fontStyle }}>
                      {this.state.dataSetRole[i]}
                    </Col>
                  </Row>
                  <Row justify={"space-between"}>
                    <Col>party_id:</Col>
                    <Col style={{ ...fontStyle }}>
                      {this.state.dataSetPartyID[i]}
                    </Col>
                  </Row>
                  <Row justify={"space-between"}>
                    <Col>dataset:</Col>
                    <Col style={{ ...fontStyle }}>{v}</Col>
                  </Row>
                </div>
              );
            })}
          </div>
          <div>
            <div style={{ marginTop: "2vh" }}>
              <span style={{ ...fontStyle }}> 开始时间:</span>
              <br />
              {this.state.startTime}
            </div>
            <div style={{ marginTop: "2vh" }}>
              <span style={{ ...fontStyle }}> 结束时间:</span>
              <br />
              {this.state.endTime}
            </div>
            <div style={{ marginTop: "2vh" }}>
              <span style={{ ...fontStyle }}> 持续:</span>
              <br />
              {this.state.duration}
            </div>
          </div>
        </div>
        <div
          style={{
            borderLeft: "1px solid",
            height: "75vh",
            width: "80%",
            float: "right",
          }}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={15}>
              <h1 style={{ marginLeft: "3vh", ...fontStyle }}>任务输出</h1>
              <div
                style={{ marginLeft: "3vh", marginBottom: "1vh", ...fontStyle }}
              >
                视图
              </div>
              <div
                style={{
                  marginLeft: "3vh",
                  border: "1px solid",
                  backgroundColor: "rgb(240,240,240)",
                }}
              >
                <MainGraph
                  component_need_run={component_need_run}
                  dependencies={dependencies}
                  key={key}
                  component_list={component_list}
                  names={names}
                  symbolSize={60}
                  id="show"
                  change={this.onChange}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </Col>
            <Col className="gutter-row" span={9}>
              <div
                style={{ marginTop: "6vh", marginBottom: "1vh", ...fontStyle }}
              >
                详情
              </div>
              <Spin spinning={this.state.loading} delay={500}>
                <div
                  style={{
                    overflow: "auto",
                    height: "53vh",
                    padding: "5px 10px",
                    backgroundColor: "rgb(240,240,240)",
                    border: "1px solid",
                  }}
                >
                  <Tree
                    selectable={false}
                    showLine={false}
                    onSelect={this.onSelect}
                    treeData={this.state.treeData}
                    style={{
                      fontSize: "small",
                      color: "rgb(153,167,193)",
                      background: "rgb(240,240,240)",
                    }}
                  />
                </div>
              </Spin>
              <Row justify={"center"}>
                <Button
                  onClick={(_e) => {
                    if (this.state.dataIndex !== "") {
                      this.props.history.push({
                        pathname: "/federalDetail/detail",
                        search: qs.stringify({
                          name: this.state.dataIndex,
                          id,
                          role,
                          partyId,
                          module: this.state.datas.module,
                        }),
                      });
                    }
                  }}
                  style={{
                    height: "6vh",

                    width: "95%",
                    borderRadius: "6px",
                    position: "absolute",
                    bottom: "0",
                  }}
                  type="primary"
                  loading={!this.state.isLoading}
                >
                  查看当前输出
                </Button>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default FederalDetail;
