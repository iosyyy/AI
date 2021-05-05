import React, { Component } from "react";
import { Button, Image, Input, Space, Table } from "antd";
import NoteImg from "../../img/Note.png";
import NoteHover from "../../img/NoteHover.png";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";

class TrainingRecord extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>ID</div>,
        dataIndex: "id",
        key: "id",
        render: (id) => (
          <div>
            <a
              style={{
                color: "rgb(65,89,209)",
              }}
              onClick={() => {
                this.props.history.push({
                  pathname: "/federalDetail/show",
                  state: { id: id },
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
        key: "startTime",
        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>结束时间</div>,
        dataIndex: "endTime",
        key: "endTime",
        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>运行时间</div>,
        dataIndex: "duration",
        key: "duration",
        render: (text, value) => {
          let time = value.endTime - value.startTime;
          let seconds = Math.floor((time / 1000) % 60);
          let minutes = Math.floor((time / 1000 / 60) % 60);
          let hour = Math.floor((time / 1000 / 60 / 60) % 60);
          console.log(seconds);
          return (
            <>
              {(hour < 10 ? "0" + hour : hour) +
                ":" +
                (minutes < 10 ? "0" + minutes : minutes) +
                ":" +
                (seconds < 10 ? "0" + seconds : seconds)}
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
        render: (text, value, context) => {
          let note = this.state.NoteNow[value.key];
          return (
            <div>
              {note.Show ? (
                <div>
                  <span>{text}</span>
                  <Image
                    onClick={() => {
                      this.setNoteShow(false, value);
                    }}
                    onMouseOver={() => {
                      this.setNotesState(NoteHover, value);
                    }}
                    onMouseLeave={() => {
                      this.setNotesState(NoteImg, value);
                    }}
                    height={15}
                    width={15}
                    src={note.Notes}
                    preview={false}
                  />
                </div>
              ) : (
                <div>
                  <Space>
                    <Input
                      style={{ display: "inline-block", width: "5vw" }}
                      onChange={(value) => {}}
                      type="text"
                    />
                    <Button
                      onClick={() => {
                        // TODO 文本信息提交到后端
                        this.setNoteShow(true, value);
                      }}
                      size={"small"}
                      type="text"
                      icon={<CheckOutlined />}
                    />
                    <Button
                      onClick={() => {
                        this.setNoteShow(true, value);
                      }}
                      size={"small"}
                      type="text"
                      icon={<CloseOutlined />}
                    />
                  </Space>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: <div>action</div>,
        dataIndex: "action",
        key: "action",
        render: (text) => {
          return <Button type={"link"}>{text}</Button>;
        },
      },
    ];
    let NoteNow = [];
    for (let i = 0; i < 25; i++) {
      NoteNow.push({ Notes: NoteImg, Show: true });
    }
    this.state = {
      columns,
      dataSource: [],
      searchText: "",
      searchedColumn: "",
      selectKey: "",
      NoteNow,
      loading: true,
    };
  }

  componentDidMount() {
    // TODO 增加ajax
    axios
      .post("http://127.0.0.1:8080/job/query/page/new", {
        fDescription: "",
        jobId: "",
        job_id: "",
        note: "",
        orderField: "f_job_id",
        orderRule: "desc",
        pageNum: 1,
        pageSize: 20,
        partyId: "",
        party_id: "",
        role: [],
        status: [],
      })
      .then((r) => {
        let list = r.data.data.list;
        let dataSource = [];
        list.forEach((values, key) => {
          let value = values["job"];
          dataSource.push({
            key: key,
            id: value.fJobId,
            startTime: value.fStartTime,
            endTime: value.fEndTime,
            duration: value.fElapsed,
            role: value.fRole,
            partyId: value.fPartyId,
            notes: value.fDescription,
            status: value.fStatus,
            action: value.fStatus === "success" ? "retry" : "",
          });
        });
        this.setState({
          dataSource,
          loading: false,
        });
      });
  }

  setNoteShow(states, value) {
    let Notew = this.state.NoteNow;
    Notew[value.key].Show = states;
    Notew[value.key].Notes = NoteImg;
    this.setState({
      NoteNow: Notew,
    });
  }

  setNotesState(states, value) {
    let Notew = this.state.NoteNow;
    Notew[value.key].Notes = states;
    this.setState({
      NoteNow: Notew,
    });
  }

  render() {
    return (
      <div className="site-layout-content">
        <Table
          loading={this.state.loading}
          scroll={{ y: "64vh" }}
          bordered={false}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={{ pageSize: 25 }}
        />
      </div>
    );
  }
}

export default TrainingRecord;
