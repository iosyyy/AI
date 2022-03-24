import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  Input,
  Modal,
  Progress,
  Row,
  Tabs,
} from "antd";
import "./index.css";
import Show from "../../../components/Show";
import bigImg from "../../../img/big.png";
import api from "../../../config/api";

const { TabPane } = Tabs;
const { TextArea } = Input;

let socket;
let socketList;
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowing: 0,
      id: this.props.location.state.id,
      info: {
        dataset: "train.csv",
        epoch: 5,
        optimizer: "sgim",
        lr: "0.01",
      },
      percent: 0,
      partyErrorMsg: "",
      partyWarningMsg: "",
      partyInfoMsg: "",
      partyDebugMsg: "",
      jobErrorMsg: "",
      jobInfoMsg: "",
      partyError: 0,
      partyWarning: 0,
      partyInfo: 0,
      partyDebug: 0,
      jobError: 0,
      jobSchedule: 0,
      isBig: false,
      names: ["Input", "HeteroLR", "Evaluation"],
      timeString: "",
      roles: [],
      role: "",
      roleDataset: {},
      startTime: 0,
      endTime: 0,
      duration: 0,
    };
  }

  showChange = (index) => {
    this.setState({
      isShowing: index,
    });
  };

  sendLogRequest() {
    socket.onopen = (_data) => {
      socket.send(
        JSON.stringify({ type: "partyError", begin: 0, end: 999999 })
      );
      socket.send(
        JSON.stringify({ type: "partyWarning", begin: 0, end: 999999 })
      );
      socket.send(JSON.stringify({ type: "partyInfo", begin: 0, end: 999999 }));
      socket.send(
        JSON.stringify({ type: "partyDebug", begin: 0, end: 999999 })
      );
      socket.send(JSON.stringify({ type: "jobError", begin: 0, end: 999999 }));
      socket.send(
        JSON.stringify({ type: "jobSchedule", begin: 0, end: 999999 })
      );
      socket.send({});
    };
  }

  componentDidMount() {
    let { id, partyId, role } = this.props.location.state;
    let url = api.logDetail
      .replace("{id}", id)
      .replace("{partyId}", partyId)
      .replace("{role}", role);

    socket = new WebSocket(url);
    this.sendLogRequest();

    let getMsg = (data) => {
      let arr;
      if (data) {
        arr = data.map((item, index) => `${index} -- ${item.content}`);
      }
      return arr.join("\n\n");
    };

    socket.onmessage = (data) => {
      let messageLog = JSON.parse(data.data);
      let msg;
      switch (messageLog.type) {
        case "logSize":
          this.setState(messageLog.data);
          break;
        case "partyError":
          msg = getMsg(messageLog.data);
          this.setState({
            partyErrorMsg: msg,
          });
          break;
        case "partyWarning":
          msg = getMsg(messageLog.data);
          this.setState({
            partyWarningMsg: msg,
          });
          break;
        case "partyInfo":
          msg = getMsg(messageLog.data);
          this.setState({
            partyInfoMsg: msg,
          });
          break;
        case "partyDebug":
          msg = getMsg(messageLog.data);
          this.setState({
            partyDebugMsg: msg,
          });
          break;
        case "jobError":
          msg = getMsg(messageLog.data);
          this.setState({
            jobErrorMsg: msg,
          });
          break;
        case "jobSchedule":
          msg = getMsg(messageLog.data);
          this.setState({
            jobScheduleMsg: msg,
          });
          break;
        default:
          break;
      }
    };
    const urlList = api.showList
      .replace("{jobId}", id)
      .replace("{role}", role)
      .replace("{partyId}", partyId);
    socketList = new WebSocket(urlList);

    socketList.onmessage = (data) => {
      const d = JSON.parse(data.data);
      const names = d.dependency_data.component_list.map(
        (item) => item.component_name
      );
      const percent = d.process;

      const time = parseInt(d.duration);
      const seconds = Math.round((time / 1000) % 60);
      const minutes = Math.round((time / 1000 / 60) % 60);
      const hour = Math.round((time / 1000 / 60 / 60) % 60);
      const timeString = `${hour < 10 ? `0${hour}` : hour}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`;
      let role, datasets;
      if (
        d.summary_date.dataset &&
        Object.keys(d.summary_date.dataset).length
      ) {
        const { roles, dataset, partner } = d.summary_date.dataset;
        const partnerObj = Object(partner);
        for (let objectKey in partnerObj) {
          if (partnerObj.hasOwnProperty(objectKey)) {
            roles[objectKey] = partner[objectKey];
          }
        }
        role = roles;
        datasets = dataset;
      }
      this.setState({
        names,
        percent,
        timeString,
        roles: role,
        roleDataset: datasets,
        startTime: d.summary_date.job.fStartTime,
        endTime: d.summary_date.job.fEndTime,
        duration: percent,
        role: d.summary_date.job.fRole,
        partyId: d.summary_date.job.fPartyId,
      });
    };
  }

  render() {
    let cur = this.state;
    const { roles } = this.state;
    const handleOk = () => {
      this.setState({
        isBig: false,
      });
    };

    const handleCancel = () => {
      this.setState({
        isBig: false,
      });
    };
    let guest = "";
    let host = "";
    let arbiter = "";
    if (roles && Object.keys(roles).length) {
      guest = roles["guest"];
      host = roles["host"];
      arbiter = roles["arbiter"];
    }
    return (
      <div className="training-details">
        <div className="trainning-details-card1-continer">
          <Card className="trainning-details-card1">
            <h4>数据信息</h4>
            <div
              style={{ fontWeight: 600, width: "18vw" }}
              className="trainning-details-info"
            >
              <Row
                justify={"space-between"}
                style={{ color: "rgb(153,155,163)", marginBottom: "0.5vh" }}
              >
                <Col>GUEST</Col>
                <Col>dataset</Col>
              </Row>
              <Row justify={"space-between"} style={{ marginBottom: "2vh" }}>
                <Col>{guest}</Col>
                <Col style={{ color: "rgb(145,89,209)" }}>{}</Col>
              </Row>
              <Row
                justify={"space-between"}
                style={{ color: "rgb(153,155,163)", marginBottom: "0.5vh" }}
              >
                <Col>HOST</Col>
                <Col>dataset</Col>
              </Row>
              <Row justify={"space-between"} style={{ marginBottom: "2vh" }}>
                <Col>{host}</Col>
                <Col style={{ color: "rgb(145,89,209)" }}>{}</Col>
              </Row>
              <Row
                justify={"space-between"}
                style={{ color: "rgb(153,155,163)", marginBottom: "0.5vh" }}
              >
                <Col>ARBITER</Col>
                <Col>dataset</Col>
              </Row>
              <Row justify={"space-between"} style={{ marginBottom: "2vh" }}>
                <Col>{arbiter}</Col>
                <Col style={{ color: "rgb(145,89,209)" }}>{}</Col>
              </Row>
            </div>
          </Card>
          <Card
            className="trainning-details-card1 c2"
            style={{ position: "relative" }}
          >
            <h4>任务</h4>
            <Progress
              percent={this.state.percent}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              status={this.state.percent === 100 ? "success" : "active"}
            />
            <h6
              style={{
                display: "block",
                position: "absolute",
                marginTop: "4vh",
                marginLeft: "-4vw",
                left: "50%",
              }}
            >
              duration:{this.state.timeString}
            </h6>
            <Button
              onClick={() => {
                this.props.history.push({
                  pathname: "/federalDetail/show",
                  state: { cur },
                });
              }}
              type="primary"
              style={{
                display: "block",
                position: "absolute",
                marginTop: "10vh",
                marginLeft: "-4vw",
                left: "50%",
              }}
            >
              view the job -&gt;
            </Button>
          </Card>
          <Card className="trainning-details-card1">
            <div>
              <span style={{ fontWeight: 600 }}>组件图</span>
              <div
                style={{
                  float: "right",
                  display: "inline",
                }}
              >
                <Button type="text" size="small">
                  <Image
                    preview={false}
                    onClick={() => {
                      this.setState({ isBig: true });
                    }}
                    src={bigImg}
                    style={{
                      width: 20,
                      height: 20,
                      display: "",
                    }}
                  />
                </Button>
              </div>
            </div>

            <Show
              names={this.state.names}
              symbolSize={32}
              id="show"
              change={this.showChange}
              style={{ width: "100%", height: "22vh" }}
            />
          </Card>
        </div>

        <Card style={{ height: "49vh" }} className="trainning-details-card2">
          <Tabs defaultActiveKey="1">
            <TabPane tab="partym Log" key="1">
              <Tabs defaultActiveKey="1" type="card">
                <TabPane
                  tab={
                    <>
                      <span>error</span>&nbsp;
                      <Badge
                        count={
                          this.state.partyError ? this.state.partyError : 0
                        }
                        style={{ backgroundColor: "red" }}
                        overflowCount={10000}
                      />
                    </>
                  }
                  key="1"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.partyErrorMsg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>warning</span>&nbsp;
                      <Badge
                        count={
                          this.state.partyWarning ? this.state.partyWarning : 0
                        }
                        overflowCount={10000}
                        style={{ backgroundColor: "gold" }}
                      />
                    </>
                  }
                  key="2"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.partyWarningMsg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>info</span>&nbsp;
                      <Badge
                        count={this.state.partyInfo ? this.state.partyInfo : 0}
                        overflowCount={10000}
                        style={{ backgroundColor: "green" }}
                      />
                    </>
                  }
                  key="3"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.partyInfoMsg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>debug</span>&nbsp;
                      <Badge
                        count={
                          this.state.partyDebug ? this.state.partyDebug : 0
                        }
                        overflowCount={10000}
                        style={{ backgroundColor: "blue" }}
                      />
                    </>
                  }
                  key="4"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.partyDebugMsg}
                  />
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="job Log" key="2" animated>
              <Tabs defaultActiveKey="1" type="card">
                <TabPane
                  tab={
                    <>
                      <span>error</span>&nbsp;
                      <Badge
                        count={this.state.jobError ? this.state.jobError : 0}
                        overflowCount={10000}
                        style={{ backgroundColor: "red" }}
                      />
                    </>
                  }
                  key="1"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.jobErrorMsg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>schedule</span>&nbsp;
                      <Badge
                        count={
                          this.state.jobSchedule ? this.state.jobSchedule : 0
                        }
                        overflowCount={10000}
                        style={{ backgroundColor: "cyan" }}
                      />
                    </>
                  }
                  key="2"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.jobScheduleMsg}
                  />
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          width="180vh"
          title="Graph"
          visible={this.state.isBig}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={
            [] // 设置footer为空，去掉 取消 确定默认按钮
          }
        >
          <Show
            names={this.state.names}
            symbolSize={60}
            id="show2"
            change={this.showChange}
            style={{ width: "100%", height: "60vh" }}
          />
        </Modal>
      </div>
    );
  }
}
