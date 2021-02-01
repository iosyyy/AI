import React, {Component} from 'react';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import PubSubJS from "pubsub-js";
import {Spin} from 'antd';


let echarts = require('echarts');
let arrX = []
let arrY = []
let myChart
export default class Show extends Component {
    constructor(props) {
        super(props);
        PubSubJS.subscribe('result', (msg, data) => {
            this.setState({info: data})
            let acc = data.acc
            let time = data.time
            arrX.push(Number.parseFloat(time.slice(0, data.time.length - 1)))
            arrY.push(Number.parseFloat(acc.slice(0, data.acc.length - 1)))
            this.setState({arrX, arrY, hidden: false})
        })
        this.state = {arrX: arrX, arrY: arrY, hidden: true}
    }

    drew() {
         // 基于准备好的dom，初始化echarts实例
        myChart.setOption({
            title: {
                text: '攻防展示',
                x: 'center',
                y: 'top',
                textAlign: 'left'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'      // 默认为直线，可选为：'line' | 'shadow'

                },
                formatter: '{b}s时<br />{a0}: {c0}%',
            },
            xAxis: {
                data: arrX,
                axisLabel: {
                    show: true,
                    interval:0,
                    textStyle: {
                        color: '#333'
                    },
                    formatter: '{value}s'
                },
            },
            yAxis: {
                min:arrY[0]-10,
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },


            series: [{
                name: '通过率',
                type: 'line',
                data: arrY,
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight',
                        formatter: '{c}%',
                    }
                },
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#1E90FF'
                            }, {
                                offset: 1,
                                color: '#0000FF'
                            }])
                        }
                    }
                },
            }]
        })

        setTimeout(function (){
            window.onresize = function () {
                myChart.resize();
            }
        },200)



    }

    componentDidMount() {
        myChart = echarts.init(document.getElementById('show'))
        this.drew()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.drew()
    }

    render() {
            return(
                <Spin tip="Loading..." spinning={this.state.hidden} delay={10}>
                    <div id="show" style={{width: 'auto', height: 400}}/>
                </Spin>
            )
    }
}
