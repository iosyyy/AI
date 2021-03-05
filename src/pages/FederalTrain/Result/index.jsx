import React, {Component} from 'react';
import {Col, Image, Row, Select} from "antd";
import fileImg from '../../../img/file.png'

class FederalResult extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.location.state.status);
        this.state = {type: true}
    }

    render() {
        return (
            <div className="site-card-wrapper site-layout-content">
                <h1 className={"colorWhite"}>联邦学习</h1>
                <Row gutter={[0, 30]}>
                    <Col/>
                </Row>
                <Row gutter={[0, 30]}>
                    <Col offset={8} span={12}>
                        <div>
                            <b>数据集选择:</b>
                        </div>
                    </Col>
                </Row>
                <Row justify="center" gutter={[0, 24]}>
                    <Col span={8}>
                        <Select style={{width: '100%'}} onChange={(e) => {
                            if (e === "option1") {
                                this.setState({
                                    type: true
                                })
                            } else {
                                this.setState({
                                    type: false
                                })
                            }

                        }} defaultValue="option1">
                            <Select.Option value="option1">横向联邦数据集</Select.Option>
                            <Select.Option value="option2">纵向联邦数据集</Select.Option>
                        </Select>
                    </Col>
                </Row>
                <Row justify="center" gutter={[0, 30]}>
                    <Col span={14}>
                        <div style={{border: "1px solid", height: '210px'}}>
                            <Row gutter={[48, 14]}>
                                <Col span={6}>
                                    <Col offset={1} span={24}>
                                    </Col>
                                    <Col offset={1} span={24}>
                                        数据浏览器
                                    </Col>
                                    <Col offset={1} span={24}>
                                        <Image height={15} width={15} src={fileImg} preview={false}/>
                                        &nbsp;
                                        <span>train.csv</span>
                                    </Col>
                                    <Col offset={1} span={24}>
                                        <Image height={15} width={15} src={fileImg} preview={false}/>
                                        &nbsp;
                                        <span>test.csv</span>
                                    </Col>
                                </Col>
                                <Col span={18}>
                                    hello world
                                </Col>
                            </Row>
                        </div>
                    </Col>

                </Row>
            </div>
        );
    }
}

export default FederalResult;
