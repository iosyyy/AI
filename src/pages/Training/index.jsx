import React, { Component } from 'react';
import './index.css';
import PubSubJS from 'pubsub-js';
import { Card, Progress } from 'antd';

class Training extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainInfo: [
        { id: '1234567891111', percent: 100 },
        { id: '5432167891111', percent: 45 },
        { id: '1234567891111', percent: 60 },
        { id: '5432167891111', percent: 11 },
        { id: '1234567891111', percent: 43 },
        { id: '5432167891111', percent: 72 },
        { id: '1234567891111', percent: 65 },
        { id: '5432167891111', percent: 97 },
        { id: '1234567891111', percent: 34 },
        { id: '5432167891111', percent: 77 },
        { id: '1234567891111', percent: 100 },
        { id: '5432167891111', percent: 49 },
      ],
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-unused-vars
    PubSubJS.subscribe('trainChoice', (msg, data) => {
      PubSubJS.publish('isRunning', { page: '5' });
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
            state: { id: item.id },
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
