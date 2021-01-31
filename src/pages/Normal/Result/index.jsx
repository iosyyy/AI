import React, { Component } from 'react'
import PubSubJS from 'pubsub-js'
import Show from "../../../components/Show";

export default class Result extends Component {

    state={
        info:{},
        epochs:0
    }
    componentDidMount(){
        PubSubJS.subscribe('result',(msg,data)=>{
            this.setState({info:data})
        })

        PubSubJS.subscribe('epochs',(msg,data)=>{
            this.setState({epochs:data})
            console.log(this.state);
        })
    }
    render() {
        return (
            <div>
                <Show info={this.state.info} epochs={this.state.epochs}/>
            </div>
        )
    }
}
