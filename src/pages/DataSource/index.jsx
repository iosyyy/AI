import React, { Component } from "react";
import { Button, Col, Menu, Row, Tabs } from "antd";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import DataSourceAdministration from "./DatasourceManage";
import DatasourceHandle from "./DatasourceHandle";
import Preprocessing from "./Preprocessing";
import PubSubJS from "pubsub-js";
import {
  EditTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SnippetsTwoTone,
} from "@ant-design/icons";

const { TabPane } = Tabs;
class DataSource extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "6" });
    PubSubJS.subscribe("datasourcePage", (msg, data) => {
      this.setState({ page: data.page });
    });
    this.state = {
      page: "1",
      collapsed: true,
    };
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div
        style={{ overflow: "auto", height: "83vh", width: "auto" }}
        className="site-layout-content"
      >
        <Tabs
          className={"ant-menu-lefts"}
          onTabClick={(e) => {
            console.log(e);
            this.props.history.push({
              pathname: "/datasource/" + e,
            });
          }}
          tabPosition={"left"}
        >
          <TabPane
            tab={
              <span>
                <SnippetsTwoTone />
                数据源管理
              </span>
            }
            key="datasourceManage"
          >
            <Switch>
              <Route
                path="/datasource/datasourceManage"
                component={DataSourceAdministration}
              />
              <Route
                path="/datasource/myDatasource"
                component={Preprocessing}
              />
              <Route
                path="/datasource/datasourceHandle"
                component={DatasourceHandle}
              />

              <Redirect to="/datasource/datasourceManage" />
            </Switch>
          </TabPane>
          <TabPane
            tab={
              <span>
                <EditTwoTone />
                预处理数据管理
              </span>
            }
            icon={<EditTwoTone />}
            key="myDatasource"
          >
            <Switch>
              <Route
                path="/datasource/datasourceManage"
                component={DataSourceAdministration}
              />
              <Route
                path="/datasource/myDatasource"
                component={Preprocessing}
              />
              <Route
                path="/datasource/datasourceHandle"
                component={DatasourceHandle}
              />

              <Redirect to="/datasource/datasourceManage" />
            </Switch>
          </TabPane>
        </Tabs>
        <Row wrap={false}>
          {/*<Col>
            <Button onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
              {React.createElement(
                this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
              )}
            </Button>
            <Menu
              theme="light"
              inlineCollapsed={this.state.collapsed}
              inlineIndent={5}
              selectedKeys={[this.state.page]}
              onSelect={(info) => {
                this.setState({
                  page: info.key,
                });
              }}
            >
              <Menu.Item key="1" icon={<SnippetsTwoTone />}>
                <NavLink to="/datasource/datasourceManage">数据源管理</NavLink>
              </Menu.Item>
              <Menu.Item key="2" icon={<EditTwoTone />}>
                <NavLink to="/datasource/myDatasource">预处理数据管理</NavLink>
              </Menu.Item>
            </Menu>
          </Col>
          <Col flex="auto">

          </Col>*/}
        </Row>
      </div>
    );
  }
}

export default DataSource;
