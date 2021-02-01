import React, { Component } from 'react'
import PubSubJS from 'pubsub-js'
import Show from "../../../components/Show";

export default class Result extends Component {

    state={
        info:{}
    }
    componentDidMount(){

    }
    render() {
        return (
            <div>
                <Show info={this.state.info}/>
            </div>
        )
    }
}
