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
  }
  render() {
    return (
      <div
        style={{ overflow: "auto", height: "83vh", width: "auto" }}
        className="site-layout-content"
      >
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
      </div>
    );
  }
}

export default DataSource;
