**TODO-LIST**

- [ ] 修改主页面的算法选择逻辑问题
- [ ] 修改页面标题
- [ ] 增加组件树

首先如何构建一个组件树.

主要使用的工具在 `src/components/TreeGraph/index.jsx` ,通过 `myChart` 构建树结构,根据传进来的trees和id和index定义一个树结构,主要通过递归的方式完成树的结构.其中传进来的trees包括以下几个参数;

1. `id`

   代表当前选择节点的id

2. `isLeaf`

   代表树节点是否为最底层的叶节点

3. `leftNodeid`

   代表左节点的id

4. `rightNodeid`

   代表右节点的id

通过这些参数我们就可以构建出一个完整的树结构.

然后我们先创建一个`myChart` ,然后调用drew方法重新绘制.

```jsx
componentDidMount() {
  let dom = document.getElementById("metricsGraphs");
  if (myChart != null && myChart !== "" && myChart !== undefined) {
    myChart.dispose(); //销毁
  }
  myChart = echarts.init(dom);
  this.drew();
}
```

`drew` 方法中主要绘制这个树并且定义一些变量

```jsx
drew = () => {
  const { trees, index, id } = this.state;

  const data = this.parseTreesToData(trees[index * 3 + id].tree, 0, []);
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
```

`this.parseTreesToData`就是获取data使用的通过递归的方法把树变成echart所接受的树变量

```jsx
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
```

然后我们会发现树组件构建完成
