import React, { Component } from "react";
import { Button, Collapse, Dropdown, Layout, Menu } from "antd";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import PubSubJS from "pubsub-js";
import Normal from "./pages/Normal";
import Federal from "./pages/Federal";

import "./App.css";
import "antd/dist/antd.css";
import FederalIndex from "./pages/FederalTrain";
import TrainingRecord from "./pages/TrainingRecord";
import Training from "./pages/Training";
import TrainingDetails from "./pages/Training/Detail";
import FederalDetailAll from "./pages/FederalDetail";
import DataSource from "./pages/DataSource";
import Avatar from "antd/es/avatar/avatar";
import { UserOutlined } from "@ant-design/icons";
import Reasoning from "./pages/Reasoning";
const { Panel } = Collapse;

const { Header, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { page: "1" };
    // FIXME 目前使用pubsubjs监听页面跳转然后来改变Menu的选择后续可以通过当前连接更改,目前先这么写方便测试
    PubSubJS.subscribe("isRunning", (msg, data) => {
      this.setState({ page: data.page });
    });
  }

  render() {
    const fontStyle = {
      fontWeight: 900,
      color: "rgb(127,125,142)",
    };
    const menu = (
      <div className="user-login-extend" style={{ background: "white" }}>
        <div style={fontStyle}>ID: 9000</div>
        <div style={fontStyle}>Role: host</div>
      </div>
    );
    return (
      <div>
        <Layout className="layout">
          <Header
            style={{
              padding: "0px 30px",
              height: "8.9vh",
              background: "rgb(10,73,123)",
            }}
          >
            <div
              style={{
                width: "200px",
                lineHeight: "5vh",
              }}
              className="logo"
            >
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  color: "rgb(218,218,224)",
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                金融数据价值多方安全共享平台
              </span>
            </div>
            <Menu
              style={{
                lineHeight: "8vh",
                height: "9vh",
                background: "rgb(10,73,123)",
              }}
              mode="horizontal"
              selectedKeys={[this.state.page]}
              onSelect={(info) => {
                this.setState({
                  page: info.key,
                });
              }}
            >
              <Menu.Item key="1">
                <NavLink
                  activeStyle={{ userSelect: "none", color: "rgb(96,185,234)" }}
                  style={{ userSelect: "none", color: "rgb(204,210,204)" }}
                  to="/federalTrain"
                >
                  联邦训练
                </NavLink>
              </Menu.Item>
              <Menu.Item key="2">
                <NavLink
                  activeStyle={{ userSelect: "none", color: "rgb(96,185,234)" }}
                  style={{ userSelect: "none", color: "rgb(204,210,204)" }}
                  to="/normal"
                >
                  联邦攻防
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink
                  activeStyle={{ userSelect: "none", color: "rgb(96,185,234)" }}
                  style={{ userSelect: "none", color: "rgb(204,210,204)" }}
                  to="/federal"
                >
                  联邦攻击
                </NavLink>
              </Menu.Item>
              <Menu.Item key="7">
                <NavLink
                  activeStyle={{ userSelect: "none", color: "rgb(96,185,234)" }}
                  style={{ userSelect: "none", color: "rgb(204,210,204)" }}
                  to="/reasoning"
                >
                  在线推理
                </NavLink>
              </Menu.Item>
              <div
                style={{
                  float: "right",
                  display: "inline-block",
                  lineHeight: "8vh",
                  height: "9vh",
                  marginLeft: "10px",
                }}
              >
                <Dropdown placement="bottomCenter" arrow overlay={menu}>
                  <Avatar size={38} icon={<UserOutlined />} />
                </Dropdown>
              </div>
              <Menu.Item style={{ float: "right" }} key="4">
                <NavLink
                  activeStyle={{ userSelect: "none", color: "rgb(96,185,234)" }}
                  style={{ userSelect: "none", color: "rgb(204,210,204)" }}
                  to="/trainingRecord"
                >
                  训练记录
                </NavLink>
              </Menu.Item>
              <Menu.Item style={{ float: "right" }} key="5">
                <NavLink
                  activeStyle={{ userSelect: "none", color: "rgb(96,185,234)" }}
                  style={{ userSelect: "none", color: "rgb(204,210,204)" }}
                  to="/training"
                >
                  正在训练
                </NavLink>
              </Menu.Item>
              <Menu.Item style={{ float: "right" }} key="6">
                <NavLink
                  activeStyle={{ userSelect: "none", color: "rgb(96,185,234)" }}
                  style={{ userSelect: "none", color: "rgb(204,210,204)" }}
                  to="/datasource"
                >
                  数据集
                </NavLink>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: "2vh 3vw" }}>
            <Switch>
              <Route path="/federalTrain" component={FederalIndex} />
              <Route path="/normal" component={Normal} />
              <Route path="/federal" component={Federal} />
              <Route path="/training" component={Training} />
              <Route path="/trainingRecord" component={TrainingRecord} />
              <Route path="/federalDetail" component={FederalDetailAll} />
              <Route path="/trainingDetails" component={TrainingDetails} />
              <Route path="/datasource" component={DataSource} />
              <Route path="/reasoning" component={Reasoning} />
              <Redirect to="/federalTrain" />
            </Switch>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
