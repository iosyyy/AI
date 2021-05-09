import React, { Component } from 'react';
import { Button, Col, Row, Tree } from 'antd';
import Show from '../../../components/Show';
import api from '../../../config/api';
import dayjs from 'dayjs';
import axios from 'axios';

class FederalDetail extends Component {
  constructor(props) {
    super(props);
    let cur = this.props.location.state.cur;
    let startTime = dayjs(cur.startTime).format('YYYY/MM/DD hh:mm:ss');
    let endTime = dayjs(cur.endTime).format('YYYY/MM/DD hh:mm:ss');
    let duration = cur.duration / 1000;
    this.state = {
      id: cur.id,
      role: cur.role,
      partyId: cur.partyId,
      status: cur.status,
      type: 'FEDERAL DEFENCE',
      startTime: startTime,
      endTime: endTime,
      duration: duration + '秒',
      names: [],
      treeData: [],
      d: {},
    };
  }

  onChange = index => {
    axios
      .post(api.showDetailParameters, {
        component_name: this.state.names[index],
        job_id: this.state.id,
        party_id: this.state.partyId,
        role: this.state.role,
      })
      .then(data => {
        let d = JSON.parse(data.data.data);
        console.log(d);
        let treeData = [
          {
            title: `module:${d.module}`,
            key: `module:${d.module}`,
            icon: <div />,
          },
          {
            title: 'SecureAddExampleParam',
            key: 'SecureAddExampleParam',
            children: [
              {
                title: 'partition:' + d.SecureAddExampleParam.partition,
                key: 'partition:' + d.SecureAddExampleParam.partition,
              },
              {
                title: 'seed:' + d.SecureAddExampleParam.seed,
                key: 'seed:' + d.SecureAddExampleParam.seed,
              },
              {
                title: 'data_num:' + d.SecureAddExampleParam.data_num,
                key: 'data_num:' + d.SecureAddExampleParam.data_num,
              },
            ],
          },
        ];
        this.setState({ treeData });
      });
  };

  getShowList(jobId, role, partyId) {
    let url = api.showList
      .replace('{jobId}', jobId)
      .replace('{role}', role)
      .replace('{partyId}', partyId);
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('连接成功');
    };

    socket.onmessage = data => {
      let d = JSON.parse(data.data);
      let names = d.dependency_data.component_list.map(
        item => item.component_name
      );
      this.setState({ names });
    };
  }

  componentDidMount() {
    this.getShowList(this.state.id, this.state.role, this.state.partyId);
  }

  render() {
    return (
      <div
        className="site-layout-content"
        style={{ height: '83vh', width: '100%' }}
      >
        <div style={{ display: 'inline-block', width: '20%', height: '75vh' }}>
          <div
            style={{
              marginRight: '1vh',
              paddingBottom: '2vh',
              borderBottom: '1px solid',
            }}
          >
            <h1>Task Summary</h1>
            <div style={{ marginTop: '4vh' }}>task ID:</div>
            <div style={{ marginBottom: '1vh' }}>{this.state.id}</div>
            <div>status:</div>
            <div style={{ marginBottom: '1vh' }}>{this.state.status}</div>
            <div>type:</div>
            <div style={{ marginBottom: '1vh' }}>{this.state.type}</div>
          </div>
          <div>
            <div style={{ marginTop: '2vh' }}>
              start time:
              <br />
              {this.state.startTime}
            </div>
            <div style={{ marginTop: '2vh' }}>
              end time:
              <br />
              {this.state.endTime}
            </div>
            <div style={{ marginTop: '2vh' }}>
              duration:
              <br />
              {this.state.duration}
            </div>
          </div>
        </div>
        <div
          style={{
            borderLeft: '1px solid',
            height: '75vh',
            width: '80%',
            float: 'right',
          }}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={15}>
              <h1 style={{ marginLeft: '3vh' }}>Outputs From Task</h1>
              <div style={{ marginLeft: '3vh', marginBottom: '1vh' }}>
                Main Graph
              </div>
              <div
                style={{
                  marginLeft: '3vh',
                  border: '1px solid',
                  backgroundColor: 'rgb(240,240,240)',
                  height: '65vh',
                }}
              >
                <Show
                  names={this.state.names}
                  symbolSize={60}
                  id="show"
                  change={this.onChange}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </Col>
            <Col className="gutter-row" span={9}>
              <div style={{ marginTop: '6vh', marginBottom: '1vh' }}>
                Information
              </div>
              <div
                style={{
                  height: '53vh',
                  padding: '5px 10px',
                  backgroundColor: 'rgb(240,240,240)',
                  border: '1px solid',
                }}
              >
                <Tree
                  defaultExpandedKeys={['0-0-0']}
                  onSelect={this.onSelect}
                  treeData={this.state.treeData}
                  style={{ background: 'rgb(240,240,240)' }}
                />
              </div>
              <Button
                onClick={e => {
                  console.log(this.state);
                  if (this.state.dataIndex !== -1) {
                    this.props.history.push({
                      pathname: '/federalDetail/detail',
                      state: { name: this.state.names[this.state.dataIndex] },
                    });
                  }
                }}
                style={{ height: '7vh', marginTop: '5vh', width: '100%' }}
                type="primary"
              >
                view the optputs
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default FederalDetail;
