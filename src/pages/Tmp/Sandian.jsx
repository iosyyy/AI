import React, { useEffect, useState } from "react";
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import axios from "axios";
import api from "../../config/api";

const echarts = require("echarts");

let myChart = [];
export default () => {
  const [list, setList] = useState([]);
  const [tmpData, setData] = useState({});

  const drew = (data, i) => {
    console.log(data)
    const series = {
      name: data.title,
      type: "scatter",
      emphasis: {
        focus: "series",
      },
      data: data.series[0].data,
    };
    const option = {
      title: {
        text: data.title,
      },
      grid: {
        left: "3%",
        right: "7%",
        bottom: "7%",
        containLabel: true,
      },
      tooltip: {
        // trigger: 'axis',
        showDelay: 0,
        formatter: function (params) {
          if (params.value.length > 1) {
            return (
              params.seriesName +
              " :<br/>" +
              params.value[0] +
              " " +
              params.value[1]
            );
          } else {
            return (
              params.seriesName + " :<br/>" + params.name + " : " + params.value
            );
          }
        },
        axisPointer: {
          show: true,
          type: "cross",
          lineStyle: {
            type: "dashed",
            width: 1,
          },
        },
      },
      toolbox: {
        feature: {
          dataZoom: {},
          brush: {
            type: ["rect", "polygon", "clear"],
          },
          saveAsImage: {},
        },
      },
      brush: {},
      xAxis: [
        {
          type: "value",
          scale: true,
          name: data.x,
          nameLocation: "middle",
          nameGap: 30,
          splitLine: {
            show: true,
          },
          position: "bottom",
        },
      ],
      yAxis: [
        {
          type: "value",
          scale: true,
          name: data.y,
          nameLocation: "middle",
          nameGap: 30,
          splitLine: {
            show: true,
          },
          position: "left",
          nameRotate: 90,
        },
      ],
      series: series,
    };
    // 基于准备好的dom，初始化echarts实例
    myChart[i].setOption(
      {
        ...option,
      },
      200
    );
  };

  useEffect(() => {
    let feature = JSON.parse(localStorage.getItem('feature')).map(item=>item.name)
    let file_path = localStorage.getItem('file_name')
    let y_feat = feature[0]
    let x_feat = feature.slice(1)
    axios.post(api.getSanDian,{file_path,y_feat,x_feat}).then((res) =>{
      console.log(res)
      if(res.data.code === 0){
        setData(res.data.data.data)
      }
    })
  }, []);

  useEffect(()=>{
    let list = [];
    for (let i = 0; i < tmpData.count; i++) {
      let obj = (
          <div
              key={i}
              id={`graph-sandiantu${i}`}
              style={{ width: "80vw", height: "80vh" }}
          />
      );
      list[i] = obj;
    }
    setList(list);
  },[tmpData])

  useEffect(() => {
    if (list.length === 0) return;
    for (let i = 0; i < tmpData.count; i++) {
      myChart[i] = echarts.init(document.getElementById(`graph-sandiantu${i}`));
      drew(tmpData.data[i], i);
    }
  }, [list]);

  return <div>{list}</div>;
};
