import React, {Component} from 'react';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

let echarts = require('echarts');
let arr = []

export default class Show extends Component {
    constructor(props) {
        super(props);
        let num=10
        this.state = {arr: []}
        let number = setInterval(() => {
            arr.push({acc: num+"%", time: "28s"})
            num+=7
            if (arr.length > 10) {
                clearInterval(number)
            }
            this.setState({arr})

        }, 1000);
    }

    drew() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('show'));
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
                data: arr.map((value, index, array) => {
                    return "第" + index + "次耗费"+value.time
                })
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
                data: arr.map((value, index, array) => {
                    let str = value.acc;
                    return Number.parseInt(str.slice(0, str.length - 1))
                }),
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
