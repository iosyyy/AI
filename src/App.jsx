import React, { Component } from "react";
import { Button, Collapse, Dropdown, Image, Layout, Menu, message } from "antd";
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
import axios from "axios";
import api from "./config/api";
import SubMenu from "antd/es/menu/SubMenu";
const { Panel } = Collapse;

const { Header, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { page: "1", party_name: "", party_id: 0 };
    // FIXME 目前使用pubsubjs监听页面跳转然后来改变Menu的选择后续可以通过当前连接更改,目前先这么写方便测试
    PubSubJS.subscribe("isRunning", (msg, data) => {
      this.setState({ page: data.page });
    });
  }

  componentDidMount() {
    axios
      .get(api.getClientInfo)
      .then((r) => {
        if (r.data.data.retcode || r.data.data.code) {
          message.error("服务验证失败,请重试");
        } else {
          const { party_name, party_id } = r.data.data.data || r.data.data;
          this.setState({
            party_name,
            party_id,
          });
        }
      })
      .catch((r) => {
        message.error("链接服务器失败请重试");
      });
  }

  render() {
    const fontStyle = {
      fontWeight: 900,
      color: "rgb(127,125,142)",
    };
    const linkStyle = {
      activeStyle: { userSelect: "none", color: "rgb(127,125,142)" },
      style: { userSelect: "none", color: "rgb(40,44,52)" },
    };
    const headerHigh = "65px";
    const headerLine = "57px";
    const headerColor = "rgb(246,239,232)";
    const menu = (
      <div className="user-login-extend" style={{ background: "white" }}>
        <div style={fontStyle}>ID: {this.state.party_id}</div>
        <div style={fontStyle}>Role: {this.state.party_name}</div>
      </div>
    );
    return (
      <div>
        <Layout className="layout">
          <Header
            style={{
              padding: "0px 32px 0px 2vw",
              height: headerHigh,
              background: headerColor,
              borderRadius: "0.1rem",
            }}
          >
            <div
              style={{
                width: "250px",
                height: "100%",
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
                width: "100%",
                lineHeight: headerLine,
                height: headerHigh,

                background: headerColor,
                fontWeight: 600,
                fontSize: "14px",
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
              <SubMenu
                style={{
                  background: headerColor,
                  color: "#050505",
                }}
                key="10"
                title="在线推理"
                selectable={false}
              >
                <Menu.Item key="8">
                  <NavLink
                    style={{
                      color: "rgb(64,64,64)",
                    }}
                    to="/reasoning/model"
                  >
                    模型部署
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="9">
                  <NavLink
                    style={{
                      color: "rgb(64,64,64)",
                    }}
                    to="/reasoning/interface"
                  >
                    单例预测
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="10">
                  <NavLink
                    style={{
                      color: "rgb(64,64,64)",
                    }}
                    to="/reasoning/batch_interface"
                  >
                    批量预测
                  </NavLink>
                </Menu.Item>
              </SubMenu>
              <div
                style={{
                  float: "right",
                  display: "inline-block",
                  height: headerHigh,
                  marginLeft: "10px",
                  marginRight: "10px",
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
          <Content
            style={{ padding: "3.5vh 3vw", background: "rgb(246,246,246)" }}
          >
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
