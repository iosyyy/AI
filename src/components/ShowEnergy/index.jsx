import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';

import { CanvasRenderer } from 'echarts/renderers';
import React from 'react';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

export default class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      option: {
        xAxis: {
          type: 'category',
          data: ['c3', 'c5', 'c8', 'c2', 'c1', 'c10', 'c8'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
          },
        ],
      },
    };
  }

  componentDidMount() {
    const chartDom = document.getElementById(this.props.id);
    const myChart = echarts.init(chartDom);
    this.state.option && myChart.setOption(this.state.option);
  }

  render() {
    return <div id={this.props.id} style={this.props.style} />;
  }
}
