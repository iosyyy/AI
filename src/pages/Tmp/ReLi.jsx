import React, { useEffect } from "react";
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

const echarts = require("echarts");

let myChart;
export default () => {
  const tmpData = {
    data: [
      [0, 0, 1.0],
      [0, 1, 0.12139286372828412],
      [1, 0, 0.12139286372828412],
      [1, 1, 1.0],
    ],
    titleLeft: ["campaign", "previous"],
    titleBottom: ["campaign", "previous"],
  };

  const drew = () => {
    const titleLeft = tmpData.titleLeft;

    const titleBottom = tmpData.titleBottom;

    const data = tmpData.data.map(function (item) {
      return [item[1], item[0], item[2] || "-"];
    });
    const option = {
      title: {
        text: "热力图",
      },
      tooltip: {
        position: "top",
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        height: "50%",
        top: "10%",
      },
      xAxis: {
        type: "category",
        data: titleLeft,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: titleBottom,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        bottom: "center",
        right: 0,
      },
      series: [
        {
          name: "Punch Card",
          type: "heatmap",
          data: data,
          label: {
            show: true,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
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
  };

  useEffect(() => {
    myChart = echarts.init(document.getElementById("graph-relitu"));
    drew();
  }, []);

  return <div id="graph-relitu" style={{ width: "80vw", height: "60vh" }} />;
};
