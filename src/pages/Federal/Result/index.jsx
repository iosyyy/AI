import React, { Component } from 'react'
import PubSubJS from 'pubsub-js'
import Show from "../../../components/Show";

export default class Result extends Component {

    state={
        info:{}
    }
    componentDidMount(){
        PubSubJS.subscribe('result2',(msg,data)=>{
            this.setState({info:data})
            console.log(this.state);
        })
    }
    render() {
        return (
            <div>
                联邦学习的结果图
            </div>
        )
    }
}