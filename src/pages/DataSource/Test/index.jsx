import React, { Component } from "react";
import { InputNumber, message, Space, Switch, Tabs } from "antd";
import Transfer from "./Components/Transfer";
import "./index.css";
import { DataSourceType } from "../../../util/dataSourceReultEnum";
import TransferLine from "./Components/TransferLine";
const toEnd = "决策树";
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
    const list4 = [
      { name: "id", now: "list1", change: false },
      { name: "x6", now: "list1", change: false },
      { name: "x7", now: "list1", change: false },
      { name: "x8", now: "list1", change: false },
      { name: "x9", now: "list1", change: false },
    ];
    const list5 = [
      { name: "id", now: "list1", change: false },
      { name: "w", now: "list1", change: false },
      { name: "x81", now: "list1", change: false },
      { name: "x82", now: "list1", change: false },
      { name: "x83", now: "list1", change: false },
    ];
    this.state = {
      list1,
      list2,
      list3,
      list4,
      list5,
      n: 0,
      activeKey: null,
      checked: localStorage.getItem("tablesSelectValue") === "探索性数据分析",
    };
  }

  back = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      list1,
      list2,
      list3,
      list4,
      n,
      list5,
      checked,
      activeKey,
    } = this.state;
    const panes = checked
      ? [
          {
            component: (
              <TransferLine
                back={this.back}
                list={list1}
                analysis={(list1, list2) => {
                  localStorage.setItem(
                    "dataSourceResultType",
                    DataSourceType.SanDian
                  );
                  localStorage.setItem("feature", JSON.stringify(list2));
                  this.props.history.push("/datasource/testResult");
                }}
              />
            ),
            title: "散点图",
          },
          {
            component: (
              <Transfer
                back={this.back}
                list={list2}
                analysis={(list1, list2) => {
                  localStorage.setItem(
                    "dataSourceResultType",
                    DataSourceType.ReLi
                  );
                  localStorage.setItem("feature", JSON.stringify(list2));

                  this.props.history.push("/datasource/testResult");
                }}
              />
            ),
            title: "热力图",
          },
          {
            component: (
              <Transfer
                back={this.back}
                list={list3}
                analysis={(list1, list2) => {
                  localStorage.setItem(
                    "dataSourceResultType",
                    DataSourceType.ZhiFang
                  );
                  localStorage.setItem("feature", JSON.stringify(list2));

                  this.props.history.push("/datasource/testResult");
                }}
              />
            ),
            title: "直方图",
          },
        ]
      : [
          {
            component: (
              <Transfer
                messageRight={"k-means只能选择两个参数 重复选择将无法进行分析"}
                back={this.back}
                list={list4}
                analysis={(list1, list2) => {
                  if (list2 && list2.length !== 2) {
                    message.error("k-means只能选择两个参数请重试");
                    return;
                  }
                  localStorage.setItem("feature", JSON.stringify(list2));
                  localStorage.setItem("n", n);

                  localStorage.setItem(
                    "dataSourceResultType",
                    DataSourceType.kMeans
                  );
                  this.props.history.push("/datasource/testResult");
                }}
              />
            ),
            title: "k-means",
          },
          {
            component: (
              <TransferLine
                messageLeft={"请将数据从右侧拖拽到此处以删除数据"}
                back={this.back}
                list={list5}
                analysis={(list1, list2) => {
                  localStorage.setItem(
                    "dataSourceResultType",
                    DataSourceType.decisionTree
                  );
                  localStorage.setItem("feature", JSON.stringify(list2));
                  localStorage.setItem("n", n);
                  this.props.history.push("/datasource/testResult");
                }}
              />
            ),
            title: "决策树",
          },
        ];
    return (
      <div className="card-container">
        <Tabs
          size={"small"}
          tabBarExtraContent={{
            right: (
              <Space>
                {checked ? (
                  <></>
                ) : (
                  <>
                    {!activeKey || activeKey === "k-means"
                      ? "类别数: "
                      : "决策树深度: "}
                    <InputNumber
                      min={0}
                      value={n}
                      onChange={(value) => {
                        this.setState({
                          n: value,
                        });
                      }}
                    />
                  </>
                )}
                <Switch
                  disabled={true}
                  defaultChecked
                  checkedChildren={checked ? "探索性数据分析" : "数据建模"}
                />
              </Space>
            ),
          }}
          onTabClick={(title) => {
            // if (title === toEnd) {
            //   localStorage.setItem(
            //     "dataSourceResultType",
            //     DataSourceType.decisionTree
            //   );
            //   this.props.history.push("/datasource/testResult");
            //   return;
            // }
            this.setState({
              activeKey: title,
            });
          }}
          activeKey={activeKey ?? panes[0].title}
        >
          {panes.map((v, i) => {
            return (
              <TabPane tab={v.title} key={v.title}>
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
