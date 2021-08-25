import React, { Component } from "react";
import * as echarts from "echarts";

let myChart;
class TreeGraph extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.id);
    this.state = {
      trees: props.trees,
      index: props.index,
      id: props.id,
      colors: props.colors,
      treeDim: props.treeDim,
      data: [],
    };
  }

  parseTreesToData = (tree, index, data) => {
    const { colors } = this.state;
    let color,
      name,
      left = -1,
      right = -1;
    const { id, fid, bid, weight, leftNodeid, rightNodeid } = tree[index];
    if (!tree[index].isLeaf) {
      color = colors[0];
      name = `ID:${id}\n x${fid} <= ${bid.toFixed(5)}`;
      left = leftNodeid;
      right = rightNodeid;
    } else {
      color = colors[1];
      name = `ID:${id}\n weight = ${weight.toFixed(5)}`;
    }
    let leftData;
    let rightData;

    if (left !== -1) {
      leftData = this.parseTreesToData(tree, left, []);
    }
    if (right !== -1) {
      rightData = this.parseTreesToData(tree, right, []);
    }
    let concat = [];
    if (leftData) {
      concat = leftData.concat(rightData);
    } else {
      concat = rightData;
    }
    data.push({
      name,
      itemStyle: {
        color,
        borderWidth: 0, //设置边框粗细
      },
      children: concat,
    });
    return data;
  };

  drew = () => {
    const { trees, index, id, treeDim } = this.state;

    const data = this.parseTreesToData(trees[index * treeDim + id].tree, 0, []);
    myChart.setOption(
      {
        tooltip: {
          formatter: function (params) {
            const { name } = params.data;
            const names = name.split("\n");
            let divs = "";
            names.forEach((v, i) => {
              divs += `<div style='text-align: center'>${v}</div>`;
            });
            return `<div style='text-align: center'>${divs}</div>`;
          },
          trigger: "item",
          triggerOn: "mousemove",
        },
        borderWidth: 0, //设置边框粗细

        series: [
          {
            type: "tree",

            data,
            animationDuration: 550,
            initialTreeDepth: trees[index * treeDim + id].tree.length, //展示的层数(从0开始)

            left: "2%",
            right: "2%",

            symbol: "roundRect",
            symbolSize: [60, 60],

            orient: "vertical",

            expandAndCollapse: true,

            label: {
              position: "inside",
              verticalAlign: "middle",
              fontSize: 8,
            },

            leaves: {
              label: {
                position: "inside",
                verticalAlign: "middle",
              },
            },

            animationDurationUpdate: 750,
          },
        ],
      },
      200
    );
    this.setState({
      data,
    });
  };

  componentDidMount() {
    let dom = document.getElementById("metricsGraphs");
    if (myChart != null && myChart !== "" && myChart !== undefined) {
      myChart.dispose(); //销毁
    }
    myChart = echarts.init(dom);
    this.drew();
  }

  render() {
    const { trees, index, id } = this.state;
    console.log(index * 3 + id);
    console.log(trees);
    return (
      <div>
        <div style={{ width: "88vw", height: "40vh" }} id={"metricsGraphs"} />
      </div>
    );
  }
}

export default TreeGraph;
