import React, {Component} from 'react';
import {Button, Image, Table} from "antd";
import test from '../../../img/iconTest.png'
import fileImg from "../../../img/file.png";
class FederalView extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state={
            choice:this.props.choice
        }
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
            }
        ];

        const columns = [
            {
                title:<div><Image height={15} width={15} src={fileImg} preview={false}/>姓名</div> ,
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
        return (
                <Table scroll={{ y: "120px" }}
                    bordered={false} dataSource={this.state.choice?dataSource1:dataSource2}
                       columns={columns}
                       pagination={false}
                />
        );
    }
}

export default FederalView;
