import React, {Component} from 'react'
import Show from "../../../components/Show";
import {notification} from "antd";

export default class Result extends Component {
    back = () => {
        notification['error']({
            message: '联邦训练失败',
            description: '数据获取失败即将跳转到表单界面',
            duration: 2.5,
            placement: 'topLeft'
        });

        setTimeout(() => {
            this.props.history.push('/federal')
        }, 1000)
    }

    render() {
        return (
            <div>
                <Show back={this.back}/>
            </div>
        )
    }
}
