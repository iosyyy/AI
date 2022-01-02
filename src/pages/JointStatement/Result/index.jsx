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
        dataIndex: "f_job_id",
        key: "f_job_id",
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
                    id: obj.f_job_id,
                    role: obj.f_initiator_role,
                    partyId: obj.f_party_id,
                    status: obj.f_status,
                    startTime: obj.f_create_time,
                    endTime: obj.f_end_time,
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
        dataIndex: "f_party_id",
        key: "f_party_id",
      },
      {
        title: <div>任务名称</div>,
        dataIndex: "f_name",
        key: "f_name",
      },
      {
        title: <div>任务描述</div>,
        dataIndex: "f_description",
        key: "f_description",
      },
      {
        title: <div>规则</div>,
        dataIndex: "f_initiator_role",
        key: "f_initiator_role",
      },
      {
        title: <div>开始时间</div>,
        dataIndex: "f_create_time",
        key: "f_create_time",
        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>结束时间</div>,
        dataIndex: "f_end_time",
        key: "f_end_time",
        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>运行时间</div>,
        dataIndex: "duration",
        key: "elapsed",

        render: (text, value) => {
          const time = value.f_end_time - value.f_create_time;
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
        dataIndex: "f_status",
        key: "f_status",
      },
    ];

    this.state = {
      columns,
      dataSource: [],

      loading: false,
      page_length: 0,
      currentPage: 1,
    };
  }

  componentDidMount() {
    PubSubJS.publish("isRunning", { page: "23" });

    this.getDataSource(1);
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
        const { dataSource, count } = r.data.data.data;
        this.setState({
          dataSource: dataSource,
          page_length: count,
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
            pageSize: 20,
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
