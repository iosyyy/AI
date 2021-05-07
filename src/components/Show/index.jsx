import React, { Component } from "react";
// 引入柱状图
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

let echarts = require("echarts");
let myChart;
export default class Show extends Component {
  constructor(props) {
    super(props);
    let colors = []
    for (let i = 0; i < 100; i++) {
      colors.push("#386db3")
    }
    this.state = {
      colors,
      colorType: colors,
      style: this.props.style,
      id: this.props.id,
      symbolSize: this.props.symbolSize,
    };
  }

  drew() {
    let datas = this.props.names.map((item, index) => {
      return {
        name: item,
        x: index * 50,
        y: index * 50,
        colors: this.state.colorType[index],
      }
    })
    let links = []
    for (let i = 0; i < this.props.names.length - 1; i++) {
      links.push({
        source: i,
        target: i + 1,
      })
    }

    let option = {
      tooltip: {},
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          itemStyle: {
            normal: {
              color: function (params) {
                return params.data.colors; //获取具体的参数
              },
            },
          },
          tooltip: { show: false },
          type: "graph",
          layout: "none",
          symbolSize: this.state.symbolSize,
          roam: false,
          label: {
            show: true,
          },
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 10,
          },
          normal: {
            label: {
              show: false,
            },
          },
          data: datas,
          // links: [],
          links: links,
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0,
          },
        },
      ],
    };
    // 基于准备好的dom，初始化echarts实例
    myChart.setOption(
      {
        ...option,
      },
      200
    );
  }

  componentDidMount() {
    let that = this;

    myChart = echarts.init(document.getElementById(this.state.id));
    myChart.on("click", function (handler, context) {
      let arr = [...that.state.colors];
      arr[handler.dataIndex] = "rgb(128,244,61)";
      that.setState({
        colorType: [...arr],
      });
      that.props.change(handler.dataIndex);
    });
    this.drew();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.drew();
  }

  render() {
    return <div id={this.state.id} style={this.state.style} />;
  }
}
