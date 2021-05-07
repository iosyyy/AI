import React, { Component } from "react";
import { Button, Col, Row } from "antd";
import Show from "../../../components/Show";
import api from "../../../config/api"
import io from "socket.io-client"

class FederalDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.location.state.id,
      role: this.props.location.state.role,
      partyId: this.props.location.state.partyId,
      status: "success",
      type: "FEDERAL DEFENCE",
      startTime: "2021-03-14  18:30:00",
      endTime: "2021-03-14  18:30:50",
      duration: "00:00:50",
      dataIndex: -1,
      names: ["Input", "HeteroLR", "Defence Test"],
    };
  }

  onChange = index => {
    console.log(index);
    this.setState({
      dataIndex: index,
    });
  };

  getShowList(jobId, role, partyId) {
    let url = api.showList.replace("{jobId}", jobId).replace("{role}", role).replace("{partyId}", partyId)
    console.log(url);
    
    const socket = io(url)

    socket.on('connect', function (data) {
      console.log("连接成功");
    })

    socket.on('disconnect', function (data) {
      console.log("断开连接");
    })

    socket.on('connect_error', function (error) {
      console.log("error");
    });
  }

  componentDidMount() {
    this.getShowList(this.state.id, this.state.role, this.state.partyId);
  }

  render() {
    return (
      <div
        className='site-layout-content'
        style={{height: "83vh", width: "100%"}}
      >
        <div style={{ display: "inline-block", width: "20%", height: "75vh" }}>
          <div
            style={{
              marginRight: "1vh",
              paddingBottom: "2vh",
              borderBottom: "1px solid",
            }}
          >
            <h1>Task Summary</h1>
            <div style={{ marginTop: "4vh" }}>task ID:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.id}</div>
            <div>status:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.status}</div>
            <div>type:</div>
            <div style={{ marginBottom: "1vh" }}>{this.state.type}</div>
          </div>
          <div>
            <div style={{ marginTop: "2vh" }}>
              start time:
              <br />
              {this.state.startTime}
            </div>
            <div style={{ marginTop: "2vh" }}>
              end time:
              <br />
              {this.state.endTime}
            </div>
            <div style={{ marginTop: "2vh" }}>
              duration:
              <br />
              {this.state.duration}
            </div>
          </div>
        </div>
        <div
          style={{
            borderLeft: "1px solid",
            height: "75vh",
            width: "80%",
            float: "right",
          }}
        >
          <Row gutter={16}>
            <Col className='gutter-row' span={15}>
              <h1 style={{ marginLeft: "3vh" }}>Outputs From Task</h1>
              <div style={{ marginLeft: "3vh", marginBottom: "1vh" }}>
                Main Graph
              </div>
              <div
                style={{
                  marginLeft: "3vh",
                  border: "1px solid",
                  backgroundColor: "rgb(240,240,240)",
                  height: "65vh",
                }}
              >
                <Show
                  names={this.state.names}
                  symbolSize={60}
                  id='show'
                  change={this.onChange}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </Col>
            <Col className='gutter-row' span={9}>
              <div style={{ marginTop: "6vh", marginBottom: "1vh" }}>
                Information
              </div>
              <div
                style={{
                  height: "53vh",
                  padding: "5px 10px",
                  backgroundColor: "rgb(240,240,240)",
                  border: "1px solid",
                }}
              >
                No Date
              </div>
              <Button
                onClick={e => {
                  console.log(this.state);
                  if (this.state.dataIndex !== -1) {
                    this.props.history.push({
                      pathname: "/federalDetail/detail",
                      state: { name: this.state.names[this.state.dataIndex] },
                    });
                  }
                }}
                style={{ height: "7vh", marginTop: "5vh", width: "100%" }}
                type='primary'
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
