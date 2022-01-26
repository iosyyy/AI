import React, { useEffect } from "react";
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import api from "../../../config/api";
import axios from "axios";

const echarts = require("echarts");

let myChart;
export default () => {
  let tmpData;

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
    let feature = JSON.parse(localStorage.getItem("feature")).map(
      (item) => item.name
    );
    let file_path = localStorage.getItem("file_name");
    axios.post(api.getReLi, { feature, file_path }).then((res) => {
      if (res.data.code === 0) {
        tmpData = res.data.data.data;
        myChart = echarts.init(document.getElementById("graph-relitu"));
        drew();
      }
    });
  }, []);

  return <div id="graph-relitu" style={{ width: "80vw", height: "80vh" }} />;
};
