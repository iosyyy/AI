import React, {Component} from 'react';
import PubSubJS from "pubsub-js";
//TODO training页面还没有实现
class Training extends Component {
    constructor(props) {
        super(props);
        let that=this
        PubSubJS.subscribe('trainChoice',(msg, data) => {
            PubSubJS.publish('isRunning', {page:"5"})
        })

    }


    render() {

        return (
            <div>
                正在训练
            </div>
        );
    }
}

export default Training;
