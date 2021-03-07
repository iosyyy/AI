import React, { Component } from "react";
import "./index.css";
import { Card, Progress } from "antd";

class Training extends Component {
  componentDidMount(){
    PubSubJS.subscribe('trainChoice',(msg, data) => {
      PubSubJS.publish('isRunning', {page:"5"})
  })
  }
  state = {
    trainInfo: [
      { id: "1234567891111", percent: 100 },
      { id: "5432167891111", percent: 45 },
    ],
  };
  render() {
    let trainList = this.state.trainInfo.map((item, index) => (
      <Card className="training-list-item" key={index}>
        <h1 style={{ margin: 0 }}>{item.id}</h1>
        <div style={{marginTop:'10px'}}>
          进度
          <Progress
            style={{ "marginLeft": "20px", width: "85%" }}
            strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            percent={item.percent}
            status={item.percent === 100 ? "succcess" : "active"}
          ></Progress>
        </div>
      </Card>
    ));

    return (
      <div>
        <h1 className={"colorWhite"}>任务列表</h1>
        <div className="training-list">{trainList}</div>
      </div>
    );
  }

}

export default Training;
