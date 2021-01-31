import React, {Component} from 'react';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

let echarts = require('echarts');
let arrX = []
let arrY = []

export default class Show extends Component {
    constructor(props) {
        super(props);
        arrX.push(props.info.acc)
        arrY.push(Number.parseInt(props.info.time.slice(0, props.info.time.length - 1)))
        this.state = {arrX: arrX,arrY:arrY}
    }

    drew() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('show'));
        // 绘制图表
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
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: '{b}<br />{a0}: {c0}%'
            },
            xAxis: {
                data: this.state.arrX,
                axisLabel: {
                    formatter: '{value}s'
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [{
                name: '通过率',
                type: 'line',
                data: this.state.arrY,
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
        });
    }

    componentDidMount() {
        this.drew()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.drew()
    }

    render() {
        return (
            <div id="show" style={{width: 'auto', height: 400}}/>
        );
    }
}
