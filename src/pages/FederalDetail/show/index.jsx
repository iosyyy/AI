import React, { Component } from 'react';
import { Button, Col, message, Row, Tree } from 'antd';
import Show from '../../../components/Show';
import api from '../../../config/api';
import dayjs from 'dayjs';
import axios from 'axios';

class FederalDetail extends Component {
  constructor(props) {
    super(props);
    const { cur } = this.props.location.state;
    const startTime = dayjs(cur.startTime).format('YYYY/MM/DD hh:mm:ss');
    const endTime = dayjs(cur.endTime).format('YYYY/MM/DD hh:mm:ss');
    const duration = cur.duration / 1000;
    this.state = {
      id: cur.id,
      role: cur.role,
      partyId: cur.partyId,
      status: cur.status,
      type: 'FEDERAL DEFENCE',
      startTime,
      endTime,
      duration: `${duration}秒`,
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
        const d = JSON.parse(data.data.data);
        let treeData = [];
        treeData = this.getDeatilList(treeData, d);
        console.log(treeData);
        this.setState({ treeData });
      })
      .catch(m => {
        message.error('服务器异常');
      });
  };

  getDeatilList(data, treeData) {
    for (let treeDataKey in treeData) {
      let child = [];
      if (typeof treeData[treeDataKey] === 'object') {
        if (treeData[treeDataKey] !== null) {
          this.getDeatilList(child, treeData[treeDataKey]);
          data.push({
            title: `${treeDataKey}`,
            key: `${treeDataKey}`,
            children: child,
          });
        } else {
          data.push({
            title: `${treeDataKey}:  ${treeData[treeDataKey]}`,
            key: `${treeDataKey}:  ${treeData[treeDataKey]}`,
          });
        }
      } else {
        data.push({
          title: `${treeDataKey}:  ${treeData[treeDataKey]}`,
          key: `${treeDataKey}:  ${treeData[treeDataKey]}`,
        });
      }
    }
    return data;
  }

  getShowList(jobId, role, partyId) {
    const url = api.showList
      .replace('{jobId}', jobId)
      .replace('{role}', role)
      .replace('{partyId}', partyId);
    const socket = new WebSocket(url);

    socket.onmessage = data => {
      const d = JSON.parse(data.data);
      const names = d.dependency_data.component_list.map(
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
                  scroll: 'auto',
                  height: '53vh',
                  padding: '5px 10px',
                  backgroundColor: 'rgb(240,240,240)',
                  border: '1px solid',
                }}
              >
                <Tree
                  selectable={false}
                  showLine={false}
                  defaultExpandedKeys={['0-0-0']}
                  onSelect={this.onSelect}
                  treeData={this.state.treeData}
                  height={'50vh'}
                  style={{
                    fontSize: 'small',
                    color: 'rgb(153,167,193)',
                    background: 'rgb(240,240,240)',
                  }}
                />
              </div>
              <Button
                onClick={e => {
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
