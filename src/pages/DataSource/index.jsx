import React, { Component } from "react";
import { Button, Col, Menu, Row } from "antd";
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
      <Row wrap={false}>
        <Col>
          <Button onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
            )}
          </Button>
          <Menu
            inlineCollapsed={this.state.collapsed}
            style={{
              background: "rgb(246,246,246)",
              marginRight: "1vw",
            }}
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
          <Switch>
            <Route
              path="/datasource/datasourceManage"
              component={DataSourceAdministration}
            />
            <Route path="/datasource/myDatasource" component={Preprocessing} />
            <Route
              path="/datasource/datasourceHandle"
              component={DatasourceHandle}
            />

            <Redirect to="/datasource/datasourceManage" />
          </Switch>
        </Col>
      </Row>
    );
  }
}

export default DataSource;
