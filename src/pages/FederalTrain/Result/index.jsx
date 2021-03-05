import React, {Component} from 'react';
import {Button, Col, Image, Row, Select} from "antd";
import fileImg from '../../../img/file.png'
import FederalView from "../View";

class FederalResult extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.location.state.status);
        this.state = {type: true, choice: true, isViewing: false}
    }

    onView = (e) => {
        console.log(e)
        this.setState({
            isViewing: true
        })
    }

    render() {
        return (
            <div className="site-card-wrapper site-layout-content">
                <h1 className={"colorWhite"}>联邦学习</h1>

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

                        }} value={this.state.type?"option1":"option2"}>
                            <Select.Option value="option1">横向联邦数据集</Select.Option>
                            <Select.Option value="option2">纵向联邦数据集</Select.Option>
                        </Select>
                    </Col>
                </Row>
                <Row justify="center" gutter={[0, 30]}>
                    <Col span={14}>
                        <div style={{border: "1px solid", height: '38vh'}}>
                            <Row gutter={[48, 1]}>
                                <Col span={6}>
                                    <Col offset={1} span={24}>
                                        <div style={{marginTop: '2vh', marginBottom: '15px'}}>数据浏览器</div>
                                    </Col>
                                    <Col offset={1} span={24}>
                                        <Button onClick={(e) => {
                                            this.setState({
                                                choice: true,
                                                isViewing:false
                                            })
                                        }} type="text">
                                            <Image height={15} width={15} src={fileImg} preview={false}/>
                                            train.csv
                                        </Button>
                                    </Col>
                                    <Col offset={1} span={24}>
                                        <Button onClick={(e) => {
                                            this.setState({
                                                choice: false,
                                                isViewing:false
                                            })
                                        }} type="text">
                                            <Image height={15} width={15} src={fileImg} preview={false}/>
                                            test.csv
                                        </Button>
                                    </Col>
                                    <Col offset={1} span={24}>
                                        <Button style={{marginTop: '13vh'}} size="small">下载</Button>
                                    </Col>
                                </Col>
                                <Col span={18}>
                                    <div style={{marginTop: '2vh', marginBottom: '15px'}}>
                                        > {this.state.choice ? "train.csv" : "test.csv"}
                                    </div>
                                    <div onClick={this.onView}
                                         style={{
                                             border: "1px solid",
                                             height: "26vh",
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             marginBottom: '10px',
                                             marginRight: '30px',
                                             padding:0
                                         }}>
                                        {
                                            this.state.isViewing ?
                                                <FederalView choice={this.state.choice}/> : this.state.choice ? "预览train.csv" : "预览test.csv"
                                        }
                                    </div>
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
