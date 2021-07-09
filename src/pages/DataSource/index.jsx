import React, { Component } from "react";
import { Menu, Row } from "antd";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import DataSourceAdministration from "./DatasourceManage";
import DatasourceHandle from "./DatasourceHandle";
import Preprocessing from "./Preprocessing";
import PubSubJS from "pubsub-js";

class DataSource extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "6" });
    PubSubJS.subscribe("datasourcePage", (msg, data) => {
      this.setState({ page: data.page });
    });
    this.state = {
      page: "1",
    };
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
          onSelect={info => {
            this.setState({
              page: info.key,
            });
          }}
        >
          <Menu.Item key='1'>
            <NavLink to='/datasource/datasourceManage'>数据源管理</NavLink>
          </Menu.Item>
          <Menu.Item key='2'>
            <NavLink to='/datasource/myDatasource'>预处理数据管理</NavLink>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route
            path='/datasource/datasourceManage'
            component={DataSourceAdministration}
          />
          <Route path='/datasource/myDatasource' component={Preprocessing} />
          <Route
            path='/datasource/datasourceHandle'
            component={DatasourceHandle}
          />

          <Redirect to='/datasource/datasourceManage' />
        </Switch>
      </Row>
    );
  }
}

export default DataSource;
