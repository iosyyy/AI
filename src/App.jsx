import React, { Component } from "react";
import { Button, Collapse, Dropdown, Image, Layout, Menu } from "antd";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import PubSubJS from "pubsub-js";
import Normal from "./pages/Normal";
import Federal from "./pages/Federal";
import logo from "./img/logo.png";
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
    const linkStyle = {
      activeStyle: { userSelect: "none", color: "rgb(96,185,234)" },
      style: { userSelect: "none", color: "rgb(227,227,227)" },
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
              padding: "0px 32px 0px 15px",
              height: "8.9vh",
              background: "rgb(10,73,123)",
            }}
          >
            <div
              style={{
                width: "250px",
                height: "100%",
                lineHeight: "5vh",
                margin: "0px 0px 0px 0px",
                display: "flex",
                alignItems: "center",
              }}
              className="logo"
            >
              <Image width={400} preview={false} src={logo} />
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
                <NavLink {...linkStyle} to="/federalTrain">
                  联邦训练
                </NavLink>
              </Menu.Item>
              <Menu.Item key="2">
                <NavLink {...linkStyle} to="/normal">
                  联邦攻防
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink {...linkStyle} to="/federal">
                  联邦攻击
                </NavLink>
              </Menu.Item>
              <Menu.Item key="7">
                <NavLink {...linkStyle} to="/reasoning">
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
                <NavLink {...linkStyle} to="/trainingRecord">
                  训练记录
                </NavLink>
              </Menu.Item>
              <Menu.Item style={{ float: "right" }} key="5">
                <NavLink {...linkStyle} to="/training">
                  正在训练
                </NavLink>
              </Menu.Item>
              <Menu.Item style={{ float: "right" }} key="6">
                <NavLink {...linkStyle} to="/datasource">
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
