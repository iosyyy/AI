import React, {Component} from 'react';
import {Button, Input, Space, Table} from "antd";
import {Link} from "react-router-dom";
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';
import { Radio } from 'antd';


//TODO 训练详情界面没有代码实现
class TrainingRecord extends Component {


    constructor(props) {
        super(props);
        const columns = [
            {
                title: <div>ID</div>,
                dataIndex: 'id',
                key: 'id',
                render: (id) => <Button onClick={()=>{
                    this.props.history.push({
                        pathname: '/federalDetail/show',
                        state: {id: id}
                    })
                }} type="link">{id}</Button>,
                ...this.getColumnSearchProps('id'),

            },
            {
                title: <div>开始时间</div>,
                dataIndex: 'startTime',
                key: 'startTime',
            },
            {
                title: <div>结束时间</div>,
                dataIndex: 'endTime',
                key: 'endTime',
            },
            {
                title: <div>运行时间</div>,
                dataIndex: 'duration',
                key: 'duration',
            },
            {
                title: <div>结果</div>,
                dataIndex: 'status',
                key: 'status',
                onFilter: (value, record) => {
                    if(value==1)
                    {
                        return record['status']==='success'
                    }else if(value==2){
                        return record['status']==='fail'
                    }else if(value==3)
                    {
                        return true
                    }

                },
                filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
                    const radioStyle = {
                        display: 'block',
                        height: '30px',
                        lineHeight: '30px',
                    };
                    return(
                        <div style={{padding: 8}}>
                            <Radio.Group onChange={(e) => {
                                setSelectedKeys([e.target.value])
                                confirm();
                                console.log(selectedKeys[0])
                                this.setState({
                                    selectKey: e.target.value,
                                });
                            }} value={selectedKeys[0]}>
                                <Radio style={radioStyle} value={1}>Success</Radio>
                                <Radio style={radioStyle} value={2}>Fail</Radio>
                                <Radio style={radioStyle} value={3}>All</Radio>
                            </Radio.Group>
                        </div>
                    )
                },
            }, {
                title: <div>类型</div>,
                dataIndex: 'type',
                key: 'type',
            },
        ];

        const dataSource = []
        for (let i = 0; i < 200; i++) {
            dataSource.push({
                id: '202102100815575259056',
                startTime: '2021-02-10 16:15:57',
                endTime: '2021-02-10 16:16:50',
                duration: '00:00:52',
                status: 'success',
                type: 'Federal'
            })
        }
        dataSource.push({
            id: '20210210081557525905-',
            startTime: '2021-02-10 16:15:57',
            endTime: '2021-02-10 16:16:50',
            duration: '00:00:52',
            status: 'fail',
            type: 'Federal'
        })
        this.state = {
            columns,
            dataSource,
            searchText: '',
            searchedColumn: '',
            selectKey:''
        }
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                </Space>
            </div>
        ),
        onFilter: (value, record) => {
           return record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : ''
        },
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Link to="/training"><Highlighter
                    highlightStyle={{backgroundColor: '#faf8ed', padding: 0}}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                /></Link>
            ) : (
                <Link to="/training">{text}</Link>
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };


    render() {
        return (
            <div className="site-layout-content">
                <Table
                    scroll={{y: "55vh"}}
                    bordered={true} dataSource={this.state.dataSource}
                    columns={this.state.columns}
                    pagination={{pageSize: 50}}
                />
            </div>
        );
    }
}

export default TrainingRecord;
