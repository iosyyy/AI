import React, { Component } from 'react'
import PubSubJS from 'pubsub-js'

export default class NormalTrainResult extends Component {

    state={
        info:{}
    }
    componentDidMount(){
        PubSubJS.subscribe('result',(msg,data)=>{
            this.setState({info:data})
            console.log(this.state);
        })
    }
    render() {
        return (
            <div>
                这是结果页面
                {this.state.info.id}
            </div>
        )
    }
}
