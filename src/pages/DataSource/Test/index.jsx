import React, { Component } from "react";
import { Button, Switch, Tabs } from "antd";
import Transfer from "./Components/Transfer";
import "./index.css";
const { TabPane } = Tabs;

class DataSourceTest extends Component {
  constructor(props) {
    super(props);
    const list1 = [
      { name: "id", now: "list1", change: false },
      { name: "x0", now: "list1", change: false },
      { name: "x1", now: "list1", change: false },
      { name: "x2", now: "list1", change: false },
      { name: "x3", now: "list1", change: false },
    ];
    const list2 = [
      { name: "id", now: "list1", change: false },
      { name: "x0", now: "list1", change: false },
      { name: "x1", now: "list1", change: false },
      { name: "x4", now: "list1", change: false },
      { name: "x5", now: "list1", change: false },
    ];
    const list3 = [
      { name: "id", now: "list1", change: false },
      { name: "x6", now: "list1", change: false },
      { name: "x7", now: "list1", change: false },
      { name: "x8", now: "list1", change: false },
      { name: "x9", now: "list1", change: false },
    ];
    this.state = {
      list1,
      list2,
      list3,
      checked: true,
    };
  }

  render() {
    const { list1, list2, list3, checked } = this.state;
    const panes = checked
      ? [
          {
            component: <Transfer list={list1} />,
            title: "散点图",
          },
          {
            component: <Transfer list={list2} />,
            title: "热力图",
          },
          {
            component: <Transfer list={list3} />,
            title: "直方图",
          },
        ]
      : [
          {
            component: <Transfer list={list1} />,
            title: "k-means",
          },
          {
            component: <Transfer list={list2} />,
            title: "决策树",
          },
        ];
    return (
      <div className="card-container">
        <Tabs
          size={"small"}
          tabBarExtraContent={{
            right: (
              <Switch
                onChange={(checked) => {
                  this.setState({
                    checked,
                  });
                }}
                defaultChecked
                checkedChildren="探索性数据分析"
                unCheckedChildren="数据建模"
              />
            ),
          }}
          defaultActiveKey="0"
        >
          {panes.map((v, i) => {
            return (
              <TabPane tab={v.title} key={i}>
                {v.component}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default DataSourceTest;
