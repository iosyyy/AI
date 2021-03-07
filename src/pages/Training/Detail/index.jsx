import React, { Component } from "react";
import { Card, Progress, Button, Tabs, Input } from "antd";
import { BulbTwoTone } from "@ant-design/icons";
import "./index.css";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default class index extends Component {
  state = {
    info: {
      dataset: "train.csv",
      epoch: 5,
      optimizer: "sgim",
      lr: "0.01",
    },
    percent: 40,
    logs: {
      algorithm: {
        error: {
          msg: "algorithm-error的数据",
        },
        warning: {
          msg: "algorithm-warning的数据",
        },
        info: {
          msg: "algorithm-info的数据",
        },
        debug: {
          msg: "algorithm-debug的数据",
        },
      },
      schedule: {
        error: {
          msg: "schedule-error的数据",
        },
        info: {
          msg: "schedule-info的数据",
        },
      },
      algorithmError: false,
      algorithmWarning: true,
      algorithmInfo: true,
      algorithmDebug: true,
      scheduleError: false,
      scheduleInfo: true,
    },
  };
  readNew1 = (key) => {
    let newData;
    switch (key) {
      case "1":
        newData = this.state.logs
        newData["algorithmError"]=false;
        break;
      case "2":
         newData = this.state.logs
        newData["algorithmWarning"]=false;
        break;
      case "3":
         newData = this.state.logs
        newData["algorithmInfo"]=false;
        break;
      case "4":
         newData = this.state.logs
        newData["algorithmDebug"]=false;
        break;
    }
    this.setState(newData)
  };
  readNew2 = (key) => {
    let newData;
    switch (key) {
      case "1":
        newData = this.state.logs
        newData["scheduleError"]=false;
        break;
      case "2":
         newData = this.state.logs
        newData["scheduleInfo"]=false;
        break;


    }
    this.setState(newData)
  };
  render() {
    return (
      <div className="training-details">
        <div className="trainning-details-card1-continer">
          <Card className="trainning-details-card1">
            <h4>Info</h4>
            <div className="trainning-details-info">
              <p>Dataset:{this.state.info.dataset}</p>
              <p>Epoch:{this.state.info.epoch}</p>
              <p>Optimizer:{this.state.info.optimizer}</p>
              <p>Lr:{this.state.info.lr}</p>
            </div>
          </Card>
          <Card className="trainning-details-card1 c2">
            <h4>Task</h4>
            <Progress
              percent={this.state.percent}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              status={this.state.percent === 100 ? "success" : "active"}
            />
            <h6>duration:00:00:56</h6>
            <Button type="primary" style={{ marginTop: "5vh", float: "right" }}>
              view the job -&gt;
            </Button>
          </Card>
          <Card className="trainning-details-card1">
            <h4>Graph</h4>
          </Card>
        </div>

        <Card className="trainning-details-card2">
          <Tabs defaultActiveKey="1">
            //algorithmm Log 一级标签
            <TabPane tab="algorithmm Log" key="1">
              <Tabs defaultActiveKey="1" type="card" onChange={this.readNew1}>
                //error
                <TabPane
                  tab={
                    <>
                      <span>error</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmError ? "#FFD700" : "#C0C0C0"
                        }
                      />
                    </>
                  }
                  key="1"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 7, maxRows: 7 }}
                    value={this.state.logs.algorithm.error.msg}
                  ></TextArea>
                </TabPane>
                //warning
                <TabPane
                  tab={
                    <>
                      <span>warning</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmWarning
                            ? "#FFD700"
                            : "#C0C0C0"
                        }
                      />
                    </>
                  }
                  key="2"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 7, maxRows: 7 }}
                    value={this.state.logs.algorithm.warning.msg}
                  ></TextArea>
                </TabPane>
                //info
                <TabPane
                  tab={
                    <>
                      <span>info</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmInfo ? "#FFD700" : "#C0C0C0"
                        }
                      />
                    </>
                  }
                  key="3"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 7, maxRows: 7 }}
                    value={this.state.logs.algorithm.info.msg}
                  ></TextArea>
                </TabPane>
                //debug
                <TabPane
                  tab={
                    <>
                      <span>debug</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmDebug ? "#FFD700" : "#C0C0C0"
                        }
                      />
                    </>
                  }
                  key="4"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 7, maxRows: 7 }}
                    value={this.state.logs.algorithm.debug.msg}
                  ></TextArea>
                </TabPane>
              </Tabs>
            </TabPane>
            //Schedule Log 一级标签
            <TabPane tab="Schedule Log" key="2" animated>
              <Tabs defaultActiveKey="1" type="card" onChange={this.readNew2}>
                //error
                <TabPane
                  tab={
                    <>
                      <span>error</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.scheduleError ? "#FFD700" : "#C0C0C0"
                        }
                      />
                    </>
                  }
                  key="1"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 7, maxRows: 7 }}
                    value={this.state.logs.schedule.error.msg}
                  ></TextArea>
                </TabPane>
                //info
                <TabPane
                  tab={
                    <>
                      <span>info</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.scheduleInfo ? "#FFD700" : "#C0C0C0"
                        }
                      />
                    </>
                  }
                  key="2"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 7, maxRows: 7 }}
                    value={this.state.logs.schedule.info.msg}
                  ></TextArea>
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
