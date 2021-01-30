import '../config/api'
import React from 'react';
import axios from 'axios';
import io from "socket.io-client"


export class Exhibition extends React.Component{

    constructor(props) {
        super(props);
        this.state={posts:{}}
    }

    componentDidMount() {
        let socket = io('http://localhost');
        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
        });
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}
