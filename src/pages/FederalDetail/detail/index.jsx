import React, {Component} from 'react';
import {Button, Table} from 'antd';
import {Link, Redirect, Route, Switch} from "react-router-dom";

class federalDetailOutput extends Component {

    constructor(props) {
        super(props);
        const columns = [
            {
                title: <div>index</div>,
                dataIndex: 'index',
                key: 'index',
            },
            {
                title: <div>id</div>,
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: <div>y</div>,
                dataIndex: 'y',
                key: 'y',
            },
            {
                title: <div>x0</div>,
                dataIndex: 'x0',
                key: 'x0',
            },
            {
                title: <div>x1</div>,
                dataIndex: 'x1',
                key: 'x1',
            },
            {
                title: <div>x2</div>,
                dataIndex: 'x2',
                key: 'x2',
            },
            {
                title: <div>x0</div>,
                dataIndex: 'x3',
                key: 'x3',
            }
        ];
        let dataSource = []
        for (let i = 0; i < 200; i++) {
            dataSource.push({
                index: i,
                id: 0,
                y: 0,
                x0: 1.8369,
                x1: 1.8369,
                x2: 1.29,
                x3: 0.322
            })
        }
        this.state = {
            columns,
            dataSource
        }
    }


    render() {
        return (<div style={{marginTop: "3vh", height: "55vh", overflow: "auto"}}><Table
            scroll={{y: "55vh"}}
            bordered={false} dataSource={this.state.dataSource}
            columns={this.state.columns}
            pagination={{pageSize: 5}}
        /></div>)
    }

}

function federalDetailLog() {
    let log="[INFO][2021-03-0707:34:18,020]\n" +
        "        [1103:140127953299264] run task[INFO] [2021-03-07 07:34:18,020][1103:140127953299264] read data[INFO][2021-03-07\n" +
        "        07:34:18,020][1103:140127953299264] check ......[INFO][2021-03-0707:34:18,020][1103:140127953299264] save data[\n" +
        "        INFo] [2021-03-07 07:34:18,020] [1103:140127953299264] successful\n" +
        "        ![INFO][2021-03-0707:34:18,020][1103:140127953299264] finished"

    return (<div
        style={{marginTop: "3vh", border: "1px solid", height: "55vh", overflow: "auto"}}>
        {log}
    </div>)

}


class FederalDetailShow extends Component {
    constructor(props) {
        super(props);
        this.state = {change: true}
    }


    render() {
        return (
            <div className="site-layout-content">
                <h1>Input</h1>
                <Button onClick={() => {
                    this.setState({change: true})
                }} type={this.state.change ? "primary" : "text"}><Link to="/federalDetail/detail/output">data output</Link></Button>
                <Button onClick={() => {
                    this.setState({change: false})
                }} type={!this.state.change ? "primary" : "text"}><Link to="/federalDetail/detail/log">log</Link></Button>
                <Switch>
                    <Route path="/federalDetail/detail/output" component={federalDetailOutput}/>
                    <Route path="/federalDetail/detail/log" component={federalDetailLog}/>
                    <Redirect to="/federalDetail/detail/output"/>
                </Switch>
            </div>
        );
    }
}

export default FederalDetailShow;
