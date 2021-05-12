import React, { Component } from 'react';
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import NoteImg from '../../img/Note.png';
import NoteHover from '../../img/NoteHover.png';
import api from '../../config/api';
import PubSubJS from 'pubsub-js';

const { Option } = Select;

class TrainingRecord extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>ID</div>,
        dataIndex: 'id',
        key: 'id',
        width: '16vw',
        render: id => (
          <div>
            <div
              style={{
                color: 'rgb(65,89,209)',
              }}
              onClick={e => {
                const cur = this.state.dataSource.filter(
                  item => item.id === id
                )[0];
                this.props.history.push({
                  pathname: '/federalDetail/show',
                  state: { cur },
                });
              }}
            >
              {id}
            </div>
          </div>
        ),
      },
      {
        title: <div>PartyID</div>,
        dataIndex: 'partyId',
        key: 'partyId',
      },
      {
        title: <div>规则</div>,
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: <div>开始时间</div>,
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: {
          compare: (a, b) => a.startTime - b.startTime,
          multiple: 1,
        },
        render: text => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>结束时间</div>,
        dataIndex: 'endTime',
        key: 'endTime',
        sorter: {
          compare: (a, b) => a.endTime - b.endTime,
          multiple: 2,
        },
        render: text => {
          return <>{new Date(text).toLocaleString()}</>;
        },
      },
      {
        title: <div>运行时间</div>,
        dataIndex: 'duration',
        key: 'duration',
        sorter: {
          compare: (a, b) => a.duration - b.duration,
          multiple: 3,
        },
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
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: <div>记录</div>,
        dataIndex: 'notes',
        key: 'notes',
        width: '9vw',
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
                            color: 'rgb(127,125,142)',
                            fontSize: 'small',
                          }}
                        >
                          ···
                        </span>
                      </Tooltip>
                    ) : (
                      text
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
                  onFinish={data => {
                    this.setState({ loading: true });
                    axios
                      .put('http://127.0.0.1:8080/job/update', {
                        job_id: value.id.toString(),
                        notes: data.notes,
                        party_id: value.partyId,
                        role: value.role,
                      })
                      .then(r => {
                        if (r.data.code === 0) {
                          const { dataSource } = this.state;
                          dataSource[value.key].notes = data.notes;
                          this.setState({
                            dataSource,
                            loading: false,
                          });
                          this.setNoteShow(true, value);
                        } else {
                          message.error(r.data.msg).then();
                          this.setState({ loading: false });
                          this.setNoteShow(true, value);
                        }
                      })
                      .catch(() => {});
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
        title: <div>action</div>,
        dataIndex: 'action',
        key: 'action',
        render: text => {
          return <Button type="link">{text}</Button>;
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
      searchText: '',
      searchedColumn: '',
      selectKey: '',
      NoteNow,
      loading: true,
      pageSize: 0,
    };
  }

  componentDidMount() {
    PubSubJS.publish('isRunning', { page: '4' });

    axios
      .post(api.pageList, {
        fDescription: '',
        jobId: '',
        job_id: '',
        note: '',
        orderField: 'f_job_id',
        orderRule: 'desc',
        pageNum: 1,
        pageSize: 20,
        partyId: '',
        party_id: '',
        role: [],
        status: [],
      })
      .then(r => {
        const { list } = r.data.data;
        const pageSize = r.data.data.totalRecord;
        const dataSource = this.getDataSourceByDataList(list);
        this.setState({
          dataSource,
          loading: false,
          pageSize,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
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
        action: value.fStatus === 'success' ? '' : 'retry',
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

  render() {
    return (
      <div className="site-layout-content">
        <div style={{ float: 'right' }}>
          <Form
            size="small"
            layout="inline"
            onFinish={res => {
              this.setState({
                loading: true,
              });
              axios
                .post(api.pageList, {
                  fDescription: res.note,
                  jobId: res.id,
                  job_id: res.id,
                  orderField: 'f_job_id',
                  orderRule: 'desc',
                  pageNum: 1,
                  pageSize: 20,
                  partyId: res.partyId,
                  party_id: res.partyId,
                  role: res.role,
                  status: res.status,
                })
                .then(r => {
                  const pageSize = r.data.data.totalRecord;
                  const dataSource = this.getDataSourceByDataList(
                    r.data.data.list
                  );
                  this.setState({
                    dataSource,
                    loading: false,
                    pageSize,
                  });
                })
                .catch(() => {
                  this.setState({
                    loading: false,
                  });
                });
            }}
          >
            <Form.Item
              label={
                <div style={{ fontWeight: 900, color: 'rgb(127,125,142)' }}>
                  Job ID
                </div>
              }
              name="id"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <div style={{ fontWeight: 900, color: 'rgb(127,125,142)' }}>
                  Role
                </div>
              }
              name="role"
            >
              <Select
                mode="multiple"
                placeholder="Select Role"
                style={{ width: '8vw' }}
              >
                <Option value="guest">guest</Option>
                <Option value="host">host</Option>
                <Option value="arbiter">arbiter</Option>
                <Option value="local">local</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <div style={{ fontWeight: 900, color: 'rgb(127,125,142)' }}>
                  Party ID
                </div>
              }
              name="partyId"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <div style={{ fontWeight: 900, color: 'rgb(127,125,142)' }}>
                  Status
                </div>
              }
              name="status"
            >
              <Select
                mode="multiple"
                placeholder="Select Status"
                style={{ width: '8vw' }}
              >
                <Option value="success">success</Option>
                <Option value="running">running</Option>
                <Option value="waiting">waiting</Option>
                <Option value="failed">failed</Option>
                <Option value="canceled">canceled</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <div style={{ fontWeight: 900, color: 'rgb(127,125,142)' }}>
                  note
                </div>
              }
              name="note"
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ borderRadius: '5vw', width: '4vw' }}
                type="primary"
                htmlType="submit"
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          loading={this.state.loading}
          scroll={{ y: '65vh' }}
          bordered={false}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={{
            pageSize: 20,
            position: ['bottomCenter'],
            size: 'small',
            total: this.state.pageSize,
            onChange: (page, _pageSize) => {
              this.setState({ loading: true });
              axios
                .post(api.pageList, {
                  fDescription: '',
                  jobId: '',
                  job_id: '',
                  note: '',
                  orderField: 'f_job_id',
                  orderRule: 'desc',
                  pageNum: page,
                  pageSize: 20,
                  partyId: '',
                  party_id: '',
                  role: [],
                  status: [],
                })
                .then(r => {
                  const { list } = r.data.data;
                  const pageSize = r.data.data.totalRecord;
                  const dataSource = this.getDataSourceByDataList(list);
                  this.setState({
                    dataSource,
                    loading: false,
                    pageSize,
                  });
                })
                .catch(() => {
                  this.setState({
                    loading: false,
                  });
                });
            },
          }}
        />
      </div>
    );
  }
}

export default TrainingRecord;
