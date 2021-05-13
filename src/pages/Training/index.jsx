import React, { Component } from 'react';
import './index.css';
import PubSubJS from 'pubsub-js';
import { Card, message, Progress } from 'antd';
import axios from 'axios';
import api from '../../config/api';

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
    PubSubJS.publish('isRunning', { page: '5' });

    let numInterval = setInterval(() => {
      axios
        .get(api.isTrainingDetail)
        .then(r => {
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
        .catch(m => {
          message.error('服务器异常');
        });
    }, 1500);

    this.setState({
      numInterval,
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
            pathname: '/trainingDetails',
            state: { id: item.id, role: item.role, partyId: item.partyId },
          });
        }}
      >
        <h1 style={{ margin: 0 }}>{item.id}</h1>
        <div style={{ marginTop: '10px' }}>
          进度
          <Progress
            style={{ marginLeft: '20px', width: '85%' }}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            percent={item.percent}
            status={item.percent === 100 ? 'succcess' : 'active'}
          />
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
