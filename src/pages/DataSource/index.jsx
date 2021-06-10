import React, { Component } from "react";
import { Menu, Row } from "antd";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import DataSourceAdministration from "./Administration";
import DatasourceHandle from "./DatasourceHandle";
import MyDatasource from "./MyDatasource";
import PubSubJS from "pubsub-js";

class DataSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "1",
    };
  }

  componentDidMount() {
    PubSubJS.publish("isRunning", { page: "6" });
  }

  render() {
    return (
      <Row>
        <Menu
          style={{
            background: "rgb(240,242,245)",
            marginRight: "2vw",
            height: "100%",
            width: "8vw",
          }}
          selectedKeys={[this.state.page]}
          onSelect={(info) => {
            this.setState({
              page: info.key,
            });
          }}
        >
          <Menu.Item key="1">
            <NavLink to="/datasource/administration">数据源管理</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/datasource/myDatasource">我的数据源</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/datasource/datasourceHandle">数据源预处理</NavLink>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route
            path="/datasource/administration"
            component={DataSourceAdministration}
          />
          <Route path="/datasource/myDatasource" component={MyDatasource} />
          <Route
            path="/datasource/datasourceHandle"
            component={DatasourceHandle}
          />

          <Redirect to="/datasource/datasourceHandle" />
        </Switch>
      </Row>
    );
  }
}

export default DataSource;
