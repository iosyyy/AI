import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tooltip,
} from "antd";
import {
  BoxPlotOutlined,
  BranchesOutlined,
  CheckOutlined,
  CloseOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import NoteImg from "../../img/Note.png";
import NoteHover from "../../img/NoteHover.png";
import api from "../../config/api";
import PubSubJS from "pubsub-js";
import qs from "qs";
import { fontStyle } from "../../util/util";

const { Option } = Select;
const { Step } = Steps;
let interval;
class TrainingRecord extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "4" });

    const columns = [
      {
        title: <div>ID</div>,
        dataIndex: "id",
        key: "id",
        width: "12vw",
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
        width: "5vw",
      },
      {
        title: <div>角色</div>,
        dataIndex: "role",
        key: "role",
        width: "5vw",
      },
      {
        title: <div>开始时间</div>,
        dataIndex: "startTime",
        key: "start_time",
        width: "5vw",

        sorter: {
          compare: (_a, _b) => {
            return true;
          },
          multiple: 1,
        },
        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>结束时间</div>,
        dataIndex: "endTime",
        key: "end_time",
        sorter: true,
        width: "5vw",

        render: (text) => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>运行时间</div>,
        dataIndex: "duration",
        key: "elapsed",
        width: "5vw",

        sorter: true,
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
        width: "5vw",
      },
      {
        title: <div>任务名称</div>,
        dataIndex: "notes",
        key: "notes",
        width: "5vw",
        render: (text, value, _context) => {
          const note = this.state.NoteNow[value.key];
          return (
            <>
              {note.Show ? (
                <Space>
                  <span>
                    {text.length >= 5 ? (
                      <Tooltip color="#108ee9" title={text}>
                        <span>{text.slice(0, 5)}</span>
                        <span
                          style={{
                            color: "rgb(127,125,142)",
                            fontSize: "small",
                          }}
                        >
                          ···
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip color="rgb(127,125,142)" title={text}>
                        {text}
                      </Tooltip>
                    )}
                  </span>

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
                </Space>
              ) : (
                <Form
                  onFinish={(data) => {
                    this.setState({ loading: true });
                    axios
                      .put(api.jobUpdate, {
                        job_id: value.id.toString(),
                        notes: data.notes,
                        party_id: value.partyId,
                        role: value.role,
                      })
                      .then((r) => {
                        if (r.data.code === 0) {
                          const { dataSource } = this.state;
                          dataSource[value.key].notes = data.notes;
                          this.setState({
                            dataSource,
                            loading: false,
                            currentPage: 1,
                          });
                          this.setNoteShow(true, value);
                        } else {
                          message.error(r.data.msg).then();
                          this.setState({ loading: false, currentPage: 1 });
                          this.setNoteShow(true, value);
                        }
                      })
                      .catch((_m) => {
                        message.error("服务器异常");
                      });
                  }}
                  size="small"
                  layout="inline"
                >
                  <Form.Item wrapperCol={{ span: 12 }} name="notes">
                    <Input placeholder="输入记录" bordered={false} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="text"
                      icon={<CheckOutlined />}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        this.setNoteShow(true, value);
                      }}
                      type="text"
                      icon={<CloseOutlined />}
                    />
                  </Form.Item>
                </Form>
              )}
            </>
          );
        },
      },
      {
        title: <div>操作</div>,
        dataIndex: "modal",
        key: "modal",
        width: "7vw",

        render: (text, obj) => {
          return (
            <Space>
              <Button
                disabled={obj.action || obj.partyId == 0 || localStorage.getItem("role") !== "guest" }
                onClick={() => {
                  this.setState({
                    id: obj.id,
                    show: true,
                  });
                }}
                type={"primary"}
              >
                部署
              </Button>

              {obj.action ? <Button>重试</Button> : <></>}
            </Space>
          );
        },
      },
    ];
    const NoteNow = [];
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
      show: false,
      id: "",
      showDetail: false,
      error: 0,
      datasource: [],
      statusNow: "error",
      nows: 0,
      percent: 0,
      pageSize: 0,
      currentPage: 1,
      searchRes: { note: "", id: "", partyId: "", role: [], status: [] },
      sorter: {
        columnKey: "job_id",
        orderRule: "desc",
      },
    };
  }

  getDataSource = () => {
    axios
      .post(api.pageList, {
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
        const { list } = r.data.data;
        const pageSize = r.data.data.totalRecord;
        const dataSource = this.getDataSourceByDataList(list);
        this.setState({
          dataSource,
          loading: false,
          pageSize,
          currentPage: 1,
        });
      })
      .catch((_m) => {
        message.error("服务器异常");
        this.setState({
          loading: false,
          currentPage: 1,
        });
      });
  };

  componentDidMount() {
    this.getDataSource();
  }

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

  setNoteShow(states, value) {
    const Notew = this.state.NoteNow;
    Notew[value.key].Show = states;
    Notew[value.key].Notes = NoteImg;
    this.setState({
      NoteNow: Notew,
    });
  }

  setNotesState(states, value) {
    const Notew = this.state.NoteNow;
    Notew[value.key].Notes = states;
    this.setState({
      NoteNow: Notew,
    });
  }
  modelUpload = () => {
    const step1 = 33.3;
    const step2 = 66.6;
    const step3 = 100;
    const { error } = this.state;
    interval = setInterval(() => {
      const { percent, nows } = this.state;
      let per = percent;
      per += Math.random() * 3;
      if (per >= error) {
        if (per > step1) {
          this.setState({
            nows: 0,
            percent: step1,
          });
        }
        clearInterval(interval);
        this.setState({
          statusNow: "error",
        });
        message.error("模型部署失败请重试");
        this.props.history.push("/reasoning/model");
        return;
      }
      if (per > step1 && nows === -1) {
        per = step1;
        clearInterval(interval);

        interval = setTimeout(() => {
          this.setState({
            nows: 0,
          });
          message.success("模型部署完成");
          interval = setInterval(() => {
            const { percent, nows } = this.state;
            let per = percent;

            per += Math.random() * 5;
            if (per >= error) {
              if (per > step2) {
                this.setState({
                  nows: 1,
                  percent: step2,
                });
              }
              this.setState({
                statusNow: "error",
              });
              clearInterval(interval);
              message.error("模型发布失败请重试");
              this.props.history.push("/reasoning/model");

              return;
            }
            if (per > step2 && nows === 0) {
              per = step2;
              clearInterval(interval);

              interval = setTimeout(() => {
                message.success("模型发布完成");
                this.setState({
                  nows: 1,
                });
                let interval = setInterval(() => {
                  const { percent, nows } = this.state;
                  let per = percent;
                  per += Math.random() * 5;
                  if (per >= error) {
                    if (per > step3) {
                      this.setState({
                        nows: 2,
                        percent: step3,
                      });
                    }
                    this.setState({
                      statusNow: "error",
                    });
                    clearInterval(interval);
                    message.error("模型绑定失败请重试");
                    this.props.history.push("/reasoning/model");

                    return;
                  }
                  if (per > step3 && nows === 1) {
                    per = step3;
                    clearInterval(interval);
                    this.props.history.push("/reasoning/model");

                    message.success("模型绑定完成");
                    this.setState({
                      nows: 2,
                      statusNow: "process",
                    });
                  }
                  this.setState({
                    percent: Math.round(per * 10) / 10,
                  });
                }, step3);
              }, 3000);
            }
            this.setState({
              percent: Math.round(per * 10) / 10,
            });
          }, step3);
        }, 1500);
      }

      this.setState({
        percent: Math.round(per * 10) / 10,
      });
    }, step3);
  };

  getData = (page, sor, resw) => {
    let res = this.state.searchRes;
    if (resw && Object.keys(resw).length) {
      res = resw;
    }
    let { sorter } = this.state;
    let orderField, orderRule;
    if (Object.keys(sorter).length) {
      orderField = `f_${sorter.columnKey}`;
      orderRule = `${sorter.order === `ascend` ? `asc` : `desc`}`;
    } else {
      orderField = "f_job_id";
      orderRule = "desc";
    }
    if (sor && Object.keys(sor).length) {
      orderField = `f_${sor.columnKey}`;
      orderRule = `${sor.order === `ascend` ? `asc` : `desc`}`;
    }
    return {
      fDescription: res.note,
      jobId: res.id,
      job_id: res.id,
      orderField,
      orderRule,
      pageNum: page,
      pageSize: 20,
      partyId: res.partyId,
      party_id: res.partyId,
      role: res.role,
      status: res.status,
    };
  };

  onTableChange = (pagination, filters, sorter) => {
    if (
      Object.keys(sorter).length &&
      (this.state.sorter.columnKey !== sorter.columnKey ||
        this.state.sorter.order !== sorter.order)
    ) {
      this.setState({ loading: true });

      axios
        .post(api.pageList, this.getData(1, sorter))
        .then((r) => {
          const { list } = r.data.data;
          const pageSize = r.data.data.totalRecord;
          const dataSource = this.getDataSourceByDataList(list);
          this.setState({
            dataSource,
            loading: false,
            pageSize,
            currentPage: 1,
            sorter,
          });
        })
        .catch((_m) => {
          message.error("服务器异常");
          this.setState({
            loading: false,
            currentPage: 1,
            sorter,
          });
        });
    } else {
      this.setState({ sorter });
    }
  };

  render() {
    const {
      show,
      id,
      loading,
      showDetail,
      nows,
      statusNow,
      percent,
    } = this.state;
    const fontStyle = { fontWeight: 900, color: "rgb(127,125,142)" };

    return (
      <div style={{ height: "85vh" }} className="site-layout-content">
        <div style={{ float: "right" }}>
          <Form
            size="small"
            layout="inline"
            onFinish={(res) => {
              this.setState({
                loading: true,
              });
              axios
                .post(api.pageList, this.getData(1, {}, res))
                .then((r) => {
                  const pageSize = r.data.data.totalRecord;
                  const dataSource = this.getDataSourceByDataList(
                    r.data.data.list
                  );
                  this.setState({
                    dataSource,
                    loading: false,
                    pageSize,
                    currentPage: 1,
                    searchRes: res,
                  });
                })
                .catch((_m) => {
                  message.error("服务器异常");
                  this.setState({
                    loading: false,
                    currentPage: 1,
                  });
                });
            }}
          >
            <Form.Item label={<div style={fontStyle}>Job ID</div>} name="id">
              <Input />
            </Form.Item>
            <Form.Item
              label={<div style={fontStyle}>Party ID</div>}
              name="partyId"
            >
              <Input />
            </Form.Item>
            <Form.Item label={<div style={fontStyle}>规则</div>} name="role">
              <Select
                mode="multiple"
                placeholder="选择规则"
                style={{ width: "8vw" }}
              >
                <Option value="guest">guest</Option>
                <Option value="host">host</Option>
                <Option value="arbiter">arbiter</Option>
                <Option value="local">local</Option>
              </Select>
            </Form.Item>

            <Form.Item label={<div style={fontStyle}>结果</div>} name="status">
              <Select
                mode="multiple"
                placeholder="选择结果"
                style={{ width: "8vw" }}
              >
                <Option value="success">success</Option>
                <Option value="running">running</Option>
                <Option value="waiting">waiting</Option>
                <Option value="failed">failed</Option>
                <Option value="canceled">canceled</Option>
              </Select>
            </Form.Item>
            <Form.Item label={<div style={fontStyle}>记录</div>} name="note">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button shape={"round"} type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          onChange={this.onTableChange}
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
            total: this.state.pageSize,
            current: this.state.currentPage,
            onChange: (page, _pageSize) => {
              this.setState({ loading: true });
              axios
                .post(api.pageList, this.getData(page))
                .then((r) => {
                  const { list } = r.data.data;
                  const pageSize = r.data.data.totalRecord;
                  const dataSource = this.getDataSourceByDataList(list);
                  this.setState({
                    dataSource,
                    loading: false,
                    pageSize,
                    currentPage: page,
                  });
                })
                .catch((_m) => {
                  message.error("服务器异常");
                  this.setState({
                    loading: false,
                    currentPage: page,
                  });
                });
            },
          }}
        />

        <Modal
          title="模型详情"
          visible={showDetail}
          onCancel={() => {
            this.setState({
              showDetail: false,
            });
            clearInterval(interval);
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  showDetail: false,
                });
                clearInterval(interval);
              }}
            >
              返回
            </Button>,
          ]}
          width={"45vw"}
          destroyOnClose
        >
          <div style={{ height: "15vh" }}>
            <Steps
              style={{ marginBottom: "3vh" }}
              current={nows}
              status={statusNow}
            >
              <Step icon={<BranchesOutlined />} title="部署" />
              <Step icon={<CloudUploadOutlined />} title="发布" />
              <Step icon={<BoxPlotOutlined />} title="绑定" />
            </Steps>
            <Progress
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
              percent={percent}
              status={statusNow}
            />
          </div>
        </Modal>
        <Modal
          title="模型部署"
          visible={show}
          onCancel={() => {
            this.setState({
              show: false,
            });
          }}
          width={"45vw"}
          footer={null}
          destroyOnClose
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ job_id: id }}
            onFinish={(e) => {
              this.setState({
                loading: true,
              });
              axios
                .post(api.modelUpdate, e)
                .then((r) => {
                  const { code, msg, data } = r.data;
                  if (code !== 1) {
                    this.setState({
                      showDetail: true,
                      percent: 0,
                      nows: -1,
                      error: (data?.location ?? 0 / 3.0) * 100,
                      statusNow: "active",
                    });
                  }
                  if (code === 1) {
                    message.error(msg);
                    return;
                  }
                  this.modelUpload();
                })
                .finally(() => {
                  this.setState({
                    loading: false,
                    show: false,
                  });
                  this.getDataSource(this.state.currentPage);
                });
            }}
            layout={"horizontal"}
          >
            {/*<Row justify={"center"}>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item*/}
            {/*      name="service_id"*/}
            {/*      label={<div style={fontStyle}>service_id</div>}*/}
            {/*      rules={[{ required: true, message: "请输入service_id" }]}*/}
            {/*    >*/}
            {/*      <Input placeholder={"请输入service_id"} />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            <Row gutter={[0, 0]} justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="job_id"
                  label={<div style={fontStyle}>相关模型</div>}
                  rules={[{ required: true, message: "请输入相关模型" }]}
                >
                  <Input placeholder={"请输入相关模型"} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[0, 30]} justify={"center"}>
              <Col span={12}>
                <Form.Item
                  name="context"
                  label={<div style={fontStyle}>备注</div>}
                  rules={[{ required: true, message: "请输入备注" }]}
                >
                  <Input placeholder={"请输入备注"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col>
                <Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default TrainingRecord;
