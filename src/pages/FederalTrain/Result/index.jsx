import React, {Component} from 'react';
import {Modal, Button, Col, Image, Row, Select, Table} from "antd";
import fileImg from '../../../img/file.png'
import bigImg from "../../../img/big.png";

class FederalResult extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.location.state.status);
        this.state = {type: true, choice: true, isViewing: false,isBig:false}
    }

    onView = (e) => {
        this.setState({
            isViewing: true
        })
    }

    onEnlarge = (e)=>{
        console.log("be large")
    }

    render() {
        const dataSource1 = [
            {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '3',
                name: '胡彦斌',
                age: 34,
                address: '西湖区湖底公园1号',
            },
            {
                key: '4',
                name: '胡彦祖',
                age: 35,
                address: '西湖区湖底公园1号',
            }]
        const dataSource2 = [
            {
                key: '1',
                name: 'ddd',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '3',
                name: 'ccc',
                age: 34,
                address: '西湖区湖底公园1号',
            },
            {
                key: '4',
                name: 'bbb',
                age: 35,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: 'aaa',
                age: 33,
                address: '西湖区湖底公园1号',
            }
        ];

        const columns = [
            {
                title: <div><Image height={15} width={15} src={fileImg} preview={false}/>姓名</div>,
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: <div><Image height={15} width={15} src={fileImg} preview={false}/>年龄</div>,
                dataIndex: 'age',
                key: 'age',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.age - b.age,
            },
            {
                title: <div><Image height={15} width={15} src={fileImg} preview={false}/>地址</div>,
                dataIndex: 'address',
                key: 'address',

            },
        ];
        const showModal = () => {
           this.setState({
               isBig:true
           })
        };
        const handleOk = () => {
            this.setState({
                isBig:false
            })
        };

        const handleCancel = () => {
            this.setState({
                isBig:false
            })
        };
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

                        }} value={this.state.type ? "option1" : "option2"}>
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
                                                isViewing: false
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
                                                isViewing: false
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
                                        {this.state.isViewing ? <div style={{float: 'right', marginRight: '4vh'}}>
                                            <Button onClick={this.onEnlarge} type="text" size="small">
                                                <Image preview={false}
                                                       onClick={showModal}
                                                       src={bigImg} style={{
                                                    width: 20,
                                                    height: 20,
                                                    display: ''
                                                }}/>
                                            </Button>
                                        </div> : <></>}
                                    </div>
                                    <div onClick={this.onView}
                                         style={{
                                             border: "1px solid",
                                             height: "26vh",
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             marginBottom: '10px',
                                             marginRight: '4vh',
                                             padding: 0
                                         }}>
                                        {
                                            this.state.isViewing ?
                                                <Table scroll={{y: "18vh"}}
                                                       bordered={false} dataSource={this.state.choice ? dataSource1 : dataSource2}
                                                       columns={columns}
                                                       pagination={false}
                                                />: this.state.choice ? "预览train.csv" : "预览test.csv"
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                </Row>
                <Row justify={'center'}>
                    <Col><Button onClick={() => {
                        this.props.history.push('/federalTrain/choice')
                    }} type="primary" htmlType="submit">下一步</Button></Col>
                </Row>
                <Modal width="180vh" title={this.state.choice?'train.csv':'test.csv'} visible={this.state.isBig} onOk={handleOk} onCancel={handleCancel} footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }>
                    <Table
                        scroll={{y: "50vh"}}
                           bordered={false} dataSource={this.state.choice ? dataSource1 : dataSource2}
                           columns={columns}
                           pagination={false}
                    />
                </Modal>
            </div>
        );
    }
}

export default FederalResult;
