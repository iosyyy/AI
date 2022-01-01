import React, { Component } from "react";
import { message, Table } from "antd";
import axios from "axios";
import NoteImg from "../../../img/Note.png";
import qs from "qs";
import api from "../../../config/api";
import PubSubJS from "pubsub-js";

class JointStatementResult extends Component {
  constructor(props) {
    super(props);

    const columns = [
      {
        title: <div>ID</div>,
        dataIndex: "id",
        key: "id",
        width: "16vw",
        render: (id, obj) => (
          <div>
            <a
              style={{
                color: "rgb(65,89,209)",
              }}
              onClick={(_e) => {
                this.props.history.push({
                  pathname: "/federalDetail/show",
                  search: qs.stringify({
                    id: obj.id,
                    role: obj.role,
                    partyId: obj.partyId,
                    status: obj.status,
                    startTime: obj.startTime,
                    endTime: obj.endTime,
                    duration: obj.duration,
                  }),
                });
              }}
            >
              {id}
            </a>
          </div>
        ),
      },
      {
        title: <div>PartyID</div>,
        dataIndex: "partyId",
        key: "partyId",
      },
      {
        title: <div>规则</div>,
        dataIndex: "role",
        key: "role",
      },
      {
        title: <div>开始时间</div>,
        dataIndex: "startTime",
        key: "start_time",
        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>结束时间</div>,
        dataIndex: "endTime",
        key: "end_time",
        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>运行时间</div>,
        dataIndex: "duration",
        key: "elapsed",
        render: (text, value) => {
          const time = value.endTime - value.startTime;
          const seconds = Math.round((time / 1000) % 60);
          const minutes = Math.round((time / 1000 / 60) % 60);
          const hour = Math.round((time / 1000 / 60 / 60) % 60);
          return (
            <>
              {`${hour < 10 ? `0${hour}` : hour}:${
                minutes < 10 ? `0${minutes}` : minutes
              }:${seconds < 10 ? `0${seconds}` : seconds}`}
            </>
          );
        },
      },
      {
        title: <div>结果</div>,
        dataIndex: "status",
        key: "status",
      },
      {
        title: <div>记录</div>,
        dataIndex: "notes",
        key: "notes",
        width: "9vw",
      },
    ];
    const NoteNow = [];
    for (let i = 0; i < 25; i++) {
      NoteNow.push({ Notes: NoteImg, Show: true });
    }
    this.state = {
      columns,
      dataSource: [],

      NoteNow,
      loading: false,
      page_length: 0,
      currentPage: 1,
    };
  }

  componentDidMount() {
    PubSubJS.publish("isRunning", { page: "23" });

    this.getDataSource(0);
  }

  getDataSource = (page) => {
    this.setState({ loading: true });
    axios
      .post(api.jobList, this.getData(page))
      .then((r) => {
        if (r.data.code !== 0) {
          message.error(r.data.msg);
          return;
        }
        const { list } = r.data.data;
        const page_length = r.data.data.totalRecord;
        const dataSource = this.getDataSourceByDataList(list);
        this.setState({
          dataSource,
          page_length,
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.setState({
          loading: false,
          currentPage: page,
        });
      });
  };

  componentWillUnmount() {
    //处理逻辑
    this.setState = (_state, _callback) => {};
  }

  getDataSourceByDataList(list) {
    const dataSource = [];
    list.forEach((values, key) => {
      const value = values.job;
      dataSource.push({
        key,
        id: value.fJobId,
        startTime: value.fStartTime,
        endTime: value.fEndTime,
        duration: value.fElapsed,
        role: value.fRole,
        partyId: value.fPartyId,
        notes: value.fDescription,
        status: value.fStatus,
        action: value.fStatus === "success" ? "" : "retry",
      });
    });
    return dataSource;
  }

  getData = (page) => {
    return {
      page: page,
      page_length: 20,
    };
  };

  render() {
    return (
      <div style={{ height: "85vh" }} className="site-layout-content">
        <Table
          loading={this.state.loading}
          scroll={{ y: "61.5vh" }}
          bordered={false}
          size={"middle"}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={{
            showSizeChanger: false,
            page_length: 20,
            position: ["bottomCenter"],
            size: "small",
            total: this.state.page_length,
            current: this.state.currentPage,
            onChange: (page, _pageSize) => {
              this.getDataSource(page);
            },
          }}
        />
      </div>
    );
  }
}

export default JointStatementResult;
