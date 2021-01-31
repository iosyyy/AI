import React, { Component } from 'react'
import PubSubJS from 'pubsub-js'
import Show from "../../../components/Show";

export default class Result extends Component {

    constructor(props) {
        super(props);
        this.state={info:{}}
    }

    render() {
        return (
            <div>
                <Show info={this.state.info}/>
            </div>
        )
    }
}
