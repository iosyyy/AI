import React, { Component } from "react";
import "./index.css";
import PubSubJS from "pubsub-js";
import { Button, Card, message, Popconfirm, Progress } from "antd";
import axios from "axios";
import api from "../../config/api";
import { QuestionCircleOutlined } from "@ant-design/icons";

class Training extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainInfo: [],
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.numInterval);
  }

  componentDidMount() {
    // eslint-disable-next-line no-unused-vars
    PubSubJS.publish("isRunning", { page: "5" });
    this.getRunning();

    let numInterval = setInterval(() => {
      this.getRunning();
    }, 1500);

    this.setState({
      numInterval,
    });
  }

  getRunning() {
    axios
      .get(api.isTrainingDetail)
      .then((r) => {
        const { data } = r.data;
        const trainInfo = data.map((v, i) => {
          return {
            id: v.fJobId,
            percent: v.fProgress,
            role: v.fRole,
            partyId: v.fPartyId,
          };
        });

        this.setState({
          trainInfo,
        });
      })
      .catch((m) => {
        message.error("服务器异常");
      });
  }

  render() {
    const trainList = this.state.trainInfo.map((item, index) => (
      <Card
        hoverable
        className="training-list-item"
        key={index.toString()}
        onDoubleClick={() => {
          this.props.history.push({
            pathname: "/trainingDetails",
            state: { id: item.id, role: item.role, partyId: item.partyId },
          });
        }}
      >
        <h1 style={{ margin: 0 }}>{item.id}</h1>
        <div style={{ marginLeft: 0, color: "rgb(190,190,190)" }}>
          Role: {item.role}
        </div>
        <div style={{ marginTop: "10px" }}>
          进度
          <Progress
            style={{ marginLeft: "20px", width: "85%" }}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={item.percent}
            status={item.percent === 100 ? "succcess" : "active"}
          />
          <Popconfirm
            title="Are you sure to delete this job?"
            onConfirm={() => {
              axios
                .post(api.stopJob, { job_id: item.id })
                .then((r) => {
                  if (r.data.code === 0) {
                    message.success(r.data.msg);
                  } else {
                    message.error(r.data.msg);
                  }
                })
                .catch((e) => {
                  message.error("服务器异常");
                });
            }}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              style={{ float: "right", marginBottom: "5vh" }}
              type={"link"}
            >
              cancel
            </Button>
          </Popconfirm>
        </div>
      </Card>
    ));

    return (
      <div>
        <h1 className="colorWhite">正在训练</h1>
        <div className="training-list">{trainList}</div>
      </div>
    );
  }
}

export default Training;
