import React, {Component} from 'react';
import {Table} from "antd";

class FederalView extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            choice: this.props.choice,
            dataSource1: this.props.dataSource1,
            dataSource2: this.props.dataSource2,
            columns: this.props.columns
        }
    }


    render() {
        const dataSource1 = this.state.dataSource1
        const dataSource2 = this.state.dataSource2
        const columns = this.state.columns
        return (
            <>
                <Table scroll={{y: "18vh"}}
                       bordered={false} dataSource={this.state.choice ? dataSource1 : dataSource2}
                       columns={columns}
                       pagination={false}
                />
            </>
        );
    }
}

export default FederalView;
