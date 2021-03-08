import React, {Component} from "react";
import {Button, Card, Col, Row, Select} from "antd";
import {openListenByNormal} from "../../../util/util";
import PubSubJS from 'pubsub-js'


export default class MyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0
        }
    }


    onFinish = (values) => {
        //开始监听服务器
        openListenByNormal(values, (data) => {
            //将从服务器得到的数据传递到result组件
            PubSubJS.publish('result', {...data, epochs: values['epochs']})
        })
        //跳转到结果页面
        this.props.history.push('/normal/result')
    };

    render() {

        return (
            <div>
                <h1 className={"colorWhite"}>联邦攻防</h1>
                <div className="site-card-wrapper">
                    <Row gutter={[0, 30]}>
                        <Col offset={8} span={12}>
                            <div>联邦类型:
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[0, 24]}>
                        <Col offset={8} span={8}>
                            <Select style={{width: '100%'}} onChange={(e) => {
                                if (e === "option1") {
                                    this.setState({
                                        type: 0
                                    })
                                } else if (e === "option2") {
                                    this.setState({
                                        type: 1
                                    })
                                } else {
                                    this.setState({
                                        type: 2
                                    })
                                }

                            }}
                                    value={this.state.type === 0 ? "option1" : this.state.type === 1 ? "option2" : "option3"}>
                                <Select.Option value="option1">free-rider攻击防御</Select.Option>
                                <Select.Option value="option2"> 分布式投毒攻击防御</Select.Option>
                                <Select.Option value="option3">推断攻击防御</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row justify="space-around" gutter={[10, 48]}>
                        <Col onClick={() => {
                            this.setState({
                                type: 0
                            })
                        }} span={6}>
                            <Card style={{backgroundColor: this.state.type === 0 ? 'RGB(96,185,234)' : '#FFF'}}
                                  headStyle={{
                                      border: 0,
                                      textAlign: 'center',
                                      color: this.state.type === 0 ? "white" : "black"
                                  }}
                                  title="free-rider攻击防御"
                                  bordered={false} hoverable={true}>
                                <div style={{height: '150px', color: this.state.type === 0 ? "white" : "black"}}>
                                    free-rider攻击：参与者不使用本地数据进行训练，而是提供伪造的模型参数以获取全局模型
                                    <br/>
                                    类型：横向联邦学习
                                </div>
                            </Card>
                        </Col>
                        <Col onClick={() => this.setState({
                            type: 1
                        })} span={6} offset={2}>
                            <Card style={{backgroundColor: this.state.type === 1 ? 'RGB(96,185,234)' : '#FFF'}}
                                  headStyle={{
                                      border: 0,
                                      textAlign: 'center',
                                      color: this.state.type === 1 ? "white" : "black"
                                  }}
                                  title="分布式投毒攻击防御" bordered={false} hoverable={true}>
                                <div style={{height: '150px', color: this.state.type === 1 ? "white" : "black"}}>
                                    分布式投毒攻击：多个攻击者修改训练数据集的标签或样本数据以降低训练的收敛速度和模型准确率。
                                    <br/>
                                    类型：横向联邦学习
                                </div>
                            </Card>
                        </Col>
                        <Col onClick={() => this.setState({
                            type: 2
                        })} span={6} offset={2}>
                            <Card style={{backgroundColor: this.state.type === 2 ? 'RGB(96,185,234)' : '#FFF'}}
                                  headStyle={{
                                      border: 0,
                                      textAlign: 'center',
                                      color: this.state.type === 2 ? "white" : "black"
                                  }}
                                  title="推断攻击防御" bordered={false} hoverable={true}>
                                <div style={{height: '150px', color: this.state.type === 2 ? "white" : "black"}}>
                                    推断攻击：当训练者为2时，攻击者通过每轮训练返回的全局模型参数和自己的模型参数反推出另一位参与者的模型参数，推断出其样本数据。
                                    <br/>
                                    类型：横向/纵向联邦学习
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={48}>
                        <Col offset={11} span={12}>
                            <Button onClick={() => {
                                this.props.history.push({
                                    pathname: '/normal/result',
                                    state: {status: this.state.type}
                                })
                            }} type="primary" htmlType="submit">
                                下一步
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
