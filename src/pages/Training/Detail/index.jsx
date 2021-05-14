import React, { Component } from 'react';
import {
  Button,
  Card,
  Col,
  Image,
  Input,
  Modal,
  Progress,
  Row,
  Tabs,
} from 'antd';
import { BulbTwoTone } from '@ant-design/icons';
import './index.css';
import Show from '../../../components/Show';
import bigImg from '../../../img/big.png';
import api from '../../../config/api';

const { TabPane } = Tabs;
const { TextArea } = Input;

let socket;
let socketList;
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.location.state.id,
      info: {
        dataset: 'train.csv',
        epoch: 5,
        optimizer: 'sgim',
        lr: '0.01',
      },
      percent: 40,
      logs: {
        algorithm: {
          error: {
            msg: 'algorithm-error的数据',
          },
          warning: {
            msg: 'algorithm-warning的数据',
          },
          info: {
            msg: 'algorithm-info的数据',
          },
          debug: {
            msg: 'algorithm-debug的数据',
          },
        },
        schedule: {
          error: {
            msg: 'schedule-error的数据',
          },
          info: {
            msg: 'schedule-info的数据',
          },
        },
        algorithmError: false,
        algorithmWarning: true,
        algorithmInfo: true,
        algorithmDebug: true,
        scheduleError: false,
        scheduleInfo: true,
        isBig: false,
      },
      names: ['Input', 'HeteroLR', 'Evaluation'],
      timeString: '',
      roles: [],
      role: '',
      roleDataset: {},
      startTime: 0,
      endTime: 0,
      duration: 0,
    };
  }

  componentWillUnmount() {
    socket.close();
    socketList.close();
  }

  componentDidMount() {
    let { id, partyId, role } = this.props.location.state;
    let url = api.logDetail
      .replace('{id}', id)
      .replace('{partyId}', partyId)
      .replace('{role}', role);

    socket = new WebSocket(url);

    socket.onopen = data => {
      socket.send(JSON.stringify({ type: 'partyInfo', begin: 0, end: 361 }));
    };
    socket.onmessage = data => {
      let messageLog = JSON.parse(data.data);
      if (messageLog.type === 'partyInfo') {
        console.log(messageLog);
        let textLog = messageLog.data;
        let { logs } = this.state;
        let text = textLog.map((v, i) => {
          return v.content;
        });
        logs.algorithm.info.msg = text.join('\n');
        this.setState({
          logs,
        });
      }

      // let detail = JSON.parse(data.data);
    };
    const urlList = api.showList
      .replace('{jobId}', id)
      .replace('{role}', role)
      .replace('{partyId}', partyId);
    socketList = new WebSocket(urlList);

    socketList.onmessage = data => {
      const d = JSON.parse(data.data);
      const names = d.dependency_data.component_list.map(
        item => item.component_name
      );
      const percent = d.process;
      const time = d.summary_date.job.fElapsed;
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

        for (let objectKey in Object(partner)) {
          roles[objectKey] = partner[objectKey];
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

  showChange = indexs => {};

  readNew1 = key => {
    let newData;
    switch (key) {
      case '1':
        newData = this.state.logs;
        newData.algorithmError = false;
        break;
      case '2':
        newData = this.state.logs;
        newData.algorithmWarning = false;
        break;
      case '3':
        newData = this.state.logs;
        newData.algorithmInfo = false;
        break;
      case '4':
        newData = this.state.logs;
        newData.algorithmDebug = false;
        break;
      default:
        break;
    }
    this.setState(newData);
  };

  readNew2 = key => {
    let newData;
    switch (key) {
      case '1':
        newData = this.state.logs;
        newData.scheduleError = false;
        break;
      case '2':
        newData = this.state.logs;
        newData.scheduleInfo = false;
        break;
      default:
        break;
    }
    this.setState(newData);
  };

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
    let guest = '';
    let host = '';
    let arbiter = '';
    if (roles && Object.keys(roles).length) {
      guest = roles['guest'];
      host = roles['host'];
      arbiter = roles['arbiter'];
    }
    return (
      <div className="training-details">
        <div className="trainning-details-card1-continer">
          <Card className="trainning-details-card1">
            <h4>Info</h4>
            <div
              style={{ fontWeight: 600, width: '18vw' }}
              className="trainning-details-info"
            >
              <Row
                justify={'space-between'}
                style={{ color: 'rgb(153,155,163)', marginBottom: '0.5vh' }}
              >
                <Col>GUEST</Col>
                <Col>dataset</Col>
              </Row>
              <Row justify={'space-between'} style={{ marginBottom: '2vh' }}>
                <Col>{guest}</Col>
                <Col style={{ color: 'rgb(145,89,209)' }}>{}</Col>
              </Row>
              <Row
                justify={'space-between'}
                style={{ color: 'rgb(153,155,163)', marginBottom: '0.5vh' }}
              >
                <Col>HOST</Col>
                <Col>dataset</Col>
              </Row>
              <Row justify={'space-between'} style={{ marginBottom: '2vh' }}>
                <Col>{host}</Col>
                <Col style={{ color: 'rgb(145,89,209)' }}>{}</Col>
              </Row>
              <Row
                justify={'space-between'}
                style={{ color: 'rgb(153,155,163)', marginBottom: '0.5vh' }}
              >
                <Col>ARBITER</Col>
                <Col>dataset</Col>
              </Row>
              <Row justify={'space-between'} style={{ marginBottom: '2vh' }}>
                <Col>{arbiter}</Col>
                <Col style={{ color: 'rgb(145,89,209)' }}>{}</Col>
              </Row>
            </div>
          </Card>
          <Card className="trainning-details-card1 c2">
            <h4>Task</h4>
            <Progress
              percent={this.state.percent}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              status={this.state.percent === 100 ? 'success' : 'active'}
            />
            <h6>duration:{this.state.timeString}</h6>
            <Button
              onClick={() => {
                this.props.history.push({
                  pathname: '/federalDetail/show',
                  state: { cur },
                });
              }}
              type="primary"
              style={{ marginTop: '5vh', float: 'right' }}
            >
              view the job -&gt;
            </Button>
          </Card>
          <Card className="trainning-details-card1">
            <div>
              <span style={{ fontWeight: 600 }}>Graph</span>
              <div
                style={{
                  float: 'right',
                  display: 'inline',
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
                      display: '',
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
              style={{ width: '100%', height: '22vh' }}
            />
          </Card>
        </div>

        <Card style={{ height: '49vh' }} className="trainning-details-card2">
          <Tabs defaultActiveKey="1">
            <TabPane tab="algorithmm Log" key="1">
              <Tabs defaultActiveKey="1" type="card" onChange={this.readNew1}>
                <TabPane
                  tab={
                    <>
                      <span>error</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmError ? '#FFD700' : '#C0C0C0'
                        }
                      />
                    </>
                  }
                  key="1"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.logs.algorithm.error.msg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>warning</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmWarning
                            ? '#FFD700'
                            : '#C0C0C0'
                        }
                      />
                    </>
                  }
                  key="2"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.logs.algorithm.warning.msg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>info</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmInfo ? '#FFD700' : '#C0C0C0'
                        }
                      />
                    </>
                  }
                  key="3"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.logs.algorithm.info.msg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>debug</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.algorithmDebug ? '#FFD700' : '#C0C0C0'
                        }
                      />
                    </>
                  }
                  key="4"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.logs.algorithm.debug.msg}
                  />
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="Schedule Log" key="2" animated>
              <Tabs defaultActiveKey="1" type="card" onChange={this.readNew2}>
                <TabPane
                  tab={
                    <>
                      <span>error</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.scheduleError ? '#FFD700' : '#C0C0C0'
                        }
                      />
                    </>
                  }
                  key="1"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.logs.schedule.error.msg}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>info</span>&nbsp;
                      <BulbTwoTone
                        twoToneColor={
                          this.state.logs.scheduleInfo ? '#FFD700' : '#C0C0C0'
                        }
                      />
                    </>
                  }
                  key="2"
                >
                  <TextArea
                    disabled
                    autoSize={{ minRows: 9, maxRows: 9 }}
                    value={this.state.logs.schedule.info.msg}
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
            style={{ width: '100%', height: '60vh' }}
          />
        </Modal>
      </div>
    );
  }
}
