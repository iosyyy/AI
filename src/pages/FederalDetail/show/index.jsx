import React, {Component} from 'react';
import {Button, Col, Row} from 'antd';
import Show from "../../../components/Show";

class FederalDetail extends Component {
    constructor(props) {
        super(props);
        console.log()
        this.state = {
            id: this.props.location.state.id,
            status: 'success',
            type: 'FEDERAL DEFENCE',
            startTime: '2021-03-14  18:30:00',
            endTime: '2021-03-14  18:30:50',
            duration: '00:00:50',
            dataIndex:-1
        }

    }

    onChange=(index)=>{
        console.log(index)
        this.setState({
            dataIndex:index
        })
    }

    render() {
        return (
            <div className="site-layout-content" style={{height: "75vh", width: "100%"}}>
                <div style={{display: "inline-block", width: "20%", height: "75vh"}}>
                    <div style={{marginRight: "1vh", paddingBottom: "2vh", borderBottom: "1px solid"}}>
                        <h1>Task Summary</h1>
                        <div style={{marginTop: "4vh"}}>task ID:</div>
                        <div style={{marginBottom: "1vh"}}>{this.state.id}</div>
                        <div>status:</div>
                        <div style={{marginBottom: "1vh"}}>{this.state.status}</div>
                        <div>type:</div>
                        <div style={{marginBottom: "1vh"}}>{this.state.type}</div>
                    </div>
                    <div>
                        <div style={{marginTop: "2vh"}}>
                            start time:
                            <br/>
                            {this.state.startTime}
                        </div>
                        <div style={{marginTop: "2vh"}}>
                            end time:
                            <br/>
                            {this.state.endTime}
                        </div>
                        <div style={{marginTop: "2vh"}}>
                            duration:
                            <br/>
                            {this.state.duration}
                        </div>
                    </div>
                </div>
                <div style={{borderLeft: "1px solid", height: "70vh", width: "80%", float: "right"}}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={15}>
                            <h1 style={{marginLeft: "3vh"}}>Outputs From Task</h1>
                            <div style={{marginLeft: "3vh", marginBottom: "1vh"}}>Main Graph</div>
                            <div style={{
                                marginLeft: "3vh",
                                border: "1px solid",
                                backgroundColor: "rgb(240,240,240)",
                                height: "57vh"
                            }}>
                                <Show symbolSize={60} id="show" change={this.onChange} style={{width: "100%", height: "100%"}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={9}>
                            <div style={{marginTop: "6vh", marginBottom: "1vh"}}>Information</div>
                            <div style={{
                                height: "45vh",
                                padding: "5px 10px",
                                backgroundColor: "rgb(240,240,240)",
                                border: "1px solid"
                            }}>No Date
                            </div>
                            <Button onClick={(e)=>{
                                console.log(this.state)
                                if(this.state.dataIndex!=-1)
                                {
                                    this.props.history.push({
                                        pathname: '/federalDetail/detail',
                                        state: {status: this.state.dataIndex}
                                    })
                                }

                            }}
                                style={{height: "7vh", marginTop: "5vh", width: "100%"}} type="primary">view the
                                optputs</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default FederalDetail;
