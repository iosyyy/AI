import React, {Component} from 'react';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

let echarts = require('echarts');
let arrX = []
let arrY = []
let status = false//false代表result true代表result2
let myChart
export default class Show extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            colors: ['#386db3', '#386db3', '#386db3'],
            colorType: ['#386db3', '#386db3', '#386db3'],
            style: this.props.style,
            id:this.props.id,
            symbolSize:this.props.symbolSize,
            names:this.props.names
        }

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
                    symbolSize: this.state.symbolSize,
                    roam: false,
                    label: {
                        show: true
                    },
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        fontSize: 10
                    },
                    normal: {
                        label: {
                            show: false
                        },

                    },
                    data: [
                        {
                            name: this.state.names[0],
                            x: 620,
                            y: 0,
                            colors: this.state.colorType[0],
                        }, {
                            name: this.state.names[1],
                            x: 650,
                            y: 30,
                            colors: this.state.colorType[1],

                        }, {
                            name: this.state.names[2],
                            x: 600,
                            y: 60,
                            colors: this.state.colorType[2],//折线点的颜色
                        }],
                    // links: [],
                    links: [{
                        source: 0,
                        target: 1,
                    }, {
                        source: 1,
                        target: 2
                    }],
                    lineStyle: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            ]
        };
        let that = this;
        // 基于准备好的dom，初始化echarts实例
        myChart.setOption({
            ...option
        }, 200)


    }

    componentDidMount() {
        let that = this;
        myChart = echarts.init(document.getElementById(this.state.id))
        myChart.on('click', function (handler, context) {
            let arr = [...that.state.colors]
            arr[handler.dataIndex] = "rgb(128,244,61)"
            that.setState({
                colorType: [...arr]
            })
            that.props.change(handler.dataIndex);

        });
        this.drew()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.drew()
    }

    render() {
        return (
            <div id={this.state.id} style={this.state.style}/>
        )
    }
}
