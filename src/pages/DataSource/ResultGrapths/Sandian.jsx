import React, { useCallback, useEffect, useState } from "react";
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import axios from "axios";
import api from "../../../config/api";

const echarts = require("echarts");

let myChart = [];
export default (props) => {
  const [list, setList] = useState([]);
  const [tmpData, setData] = useState(null);

  const drew = (data, i) => {
    console.log(data);
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

  function color() {
    //16进制随机数生成 颜色值
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
  }

  const drew2 = (data) => {
    console.log(data);
    if (data === null) return;
    let series = [];
    const colors = [];
    for (let i = 0; i < data.series.length; i++) {
      colors.push(color());
    }
    data.legend.data[0].forEach((item, index) => {
      series.push({
        name: index,
        color: colors[index],
        type: "effectScatter",
        symbolSize: 20,
        data: [item],
      });
    });
    data.series.forEach((item, index) => {
      series.push({
        name: item.name,
        color: colors[index],
        type: "scatter",
        data: item.data,
      });
    });

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
            return "(" + params.value[0] + " " + params.value[1] + ")";
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
    myChart[0].setOption(
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
    let n = localStorage.getItem("n");
    let y_feat = feature[0];
    let x_feat = feature.slice(1);
    let data;
    let url;
    switch (props.type) {
      case "zhifang": {
        data = { file_path, y_feat, x_feat };
        url = api.getSanDian;
        break;
      }
      case "k-means":
        data = {
          feature,
          n,
          file_path,
        };
        url = api.getKmeans;
        break;
    }
    axios.post(url, data).then((res) => {
      if (res.data.code === 0) {
        console.log(res.data.data.data);
        setData(res.data.data.data);
        getList(res.data.data.data);
      }
    });
  }, []);

  const getList = useCallback(
    (tmpData) => {
      let list = [];

      let t = props.type === "k-means" ? 1 : tmpData.count;
      for (let i = 0; i < t; i++) {
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
    },
    [tmpData]
  );

  useEffect(() => {
    if (list.length === 0) return;
    let t = props.type === "k-means" ? 1 : tmpData.count;
    for (let i = 0; i < t; i++) {
      myChart[i] = echarts.init(document.getElementById(`graph-sandiantu${i}`));
      if (props.type === "k-means") {
        drew2(tmpData);
      } else {
        drew(tmpData.data[i], i);
      }
    }
  }, [list]);

  return <div>{list}</div>;
};
