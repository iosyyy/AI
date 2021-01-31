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
            console.log('从服务器得到数据',this.state);
        })
    }
    render() {
        return (
            <div>
                <Show info={this.state.info}/>
            </div>
        )
    }
}