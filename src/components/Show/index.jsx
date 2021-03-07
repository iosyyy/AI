import React, {Component} from 'react';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import {Spin} from 'antd';

let echarts = require('echarts');
let arrX = []
let arrY = []
let status = false//false代表result true代表result2
let myChart
export default class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {colors:['#386db3','#386db3','#386db3'],colorType:['#386db3','#386db3','#386db3'],style:this.props.style}

    }

    drew() {
        let option = {
            tooltip: {},
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return params.data.colors //获取具体的参数
                            },
                        }
                    },
                    tooltip: {show: false},
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 50,
                    roam: false,
                    label: {
                        show: true
                    },
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        fontSize: 20
                    },
                    normal: {
                        label: {
                            show: false
                        },

                    },
                    data: [
                        {
                            name: '节点1',
                            x: 550,
                            y: 100,
                            colors: this.state.colorType[0],
                        }, {
                            name: '节点2',
                            x: 350,
                            y: 300,
                            colors: this.state.colorType[1],

                        }, {
                            name: '节点3',
                            x: 500,
                            y: 500,
                            colors: this.state.colorType[2],//折线点的颜色
                        }],
                    // links: [],
                    links: [{
                        source: '节点1',
                        target: '节点2'
                    }, {
                        source: '节点2',
                        target: '节点3'
                    }],
                    lineStyle: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            ]
        };
        let that=this;
        // 基于准备好的dom，初始化echarts实例
        myChart.setOption({
            ...option
        }, 200)
        myChart.on('click', function (handler,context){
            let arr=[...that.state.colors]
            arr[handler.dataIndex]="rgb(56,217,148)"
            that.props.change(handler.dataIndex);
            that.setState({
                colorType:[...arr]
            })
        });

    }

    componentDidMount() {
        myChart = echarts.init(document.getElementById('show'))
        this.drew()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.drew()
    }

    render() {
        return (
                <div id="show" style={this.state.style}/>
        )
    }
}
