import '../config/api'
import React from 'react';
import axios from 'axios';
import io from "socket.io-client"


export class Exhibition extends React.Component{

    constructor(props) {
        super(props);
        this.state={data:{}}
    }

    componentDidMount() {
        let socket = io(this.props.source);
        let that=this
        socket.on('news', function (data) {
            that.setState({data})
            socket.emit('getSuccess', { success: 0 });
        });
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}
