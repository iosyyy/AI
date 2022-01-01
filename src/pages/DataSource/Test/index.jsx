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
    const listData = JSON.parse(localStorage.getItem("processTableData"));
    console.log(listData);
    const list1 = listData.map((v, i) => {
      return { name: v, now: "list1", change: false };
    });
    const list2 = [...list1];
    const list3 = [...list1];
    const list4 = [...list1];
    const list5 = [...list1];

    this.state = {
      list1,
      list2,
      list3,
      list4,
      list5,
      n: 1,
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
                  if (list2.length < 2) {
                    message.error("散点图应最少具有两个参数");
                    return;
                  }
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
                  if (list2.length < 2) {
                    message.error("热力图应最少具有两个参数");
                    return;
                  }
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
                  if (list2.length < 1) {
                    message.error("直方图应最少具有一个参数");
                    return;
                  }
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
                  if (list2.length < 2) {
                    message.error("决策树应最少具有两个参数");
                    return;
                  }
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
                      min={1}
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
