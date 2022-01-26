import React, { Component } from "react";
import * as echarts from "echarts";

let myChart;
class TreeGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trees: props.trees,
      index: props.index,
      id: props.id,
      colors: props.colors,
      treeDim: props.treeDim,
      numClasses: props.numClasses,
      featureNameFidMapping: props.featureNameFidMapping,
      data: [],
    };
  }

  parseTreesToData = (tree, index, data, splitMaskdict) => {
    const { colors, featureNameFidMapping, numClasses } = this.state;
    let color,
      name,
      left = -1,
      right = -1;
    const { id, fid, bid, weight, leftNodeid, rightNodeid, sitename } = tree[
      index
    ];
    if (!tree[index].isLeaf) {
      color = colors[0];
      left = leftNodeid;
      right = rightNodeid;
      if (numClasses === 1) {
        name = `ID:${id}\n ${featureNameFidMapping[fid]} <= ${bid.toFixed(5)}`;
      } else {
        if (splitMaskdict.hasOwnProperty(id)) {
          name = `ID:${id}\n ${featureNameFidMapping[fid]} <=${splitMaskdict[
            id
          ].toFixed(5)} `;
        } else {
          name = `ID:${id}\n ${sitename.toLocaleUpperCase()}`;
        }
      }
    } else {
      color = colors[1];
      if (numClasses === 1) {
        name = `ID:${id}\n weight = ${weight.toFixed(5)}`;
      } else {
        name = `ID:${id}\n weight = ${weight.toFixed(
          5
        )}\n ${sitename.toLocaleUpperCase()}`;
      }
    }
    let leftData;
    let rightData;

    if (left !== -1) {
      leftData = this.parseTreesToData(tree, left, [], splitMaskdict);
    }
    if (right !== -1) {
      rightData = this.parseTreesToData(tree, right, [], splitMaskdict);
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

    const data = this.parseTreesToData(
      trees[index * treeDim + id].tree,
      0,
      [],
      trees[index * treeDim + id].splitMaskdict
    );
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
    return (
      <div>
        <div style={{ width: "88vw", height: "40vh" }} id={"metricsGraphs"} />
      </div>
    );
  }
}

export default TreeGraph;
