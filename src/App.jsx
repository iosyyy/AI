import React, { Component } from "react";
import {
  Button,
  Col,
  Collapse,
  Dropdown,
  Image,
  Layout,
  Menu,
  message,
  Row,
} from "antd";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import PubSubJS from "pubsub-js";
import Normal from "./pages/Normal";
import Federal from "./pages/Federal";
import logo from "./img/logolast.png";
import "./App.css";
import "antd/dist/antd.css";
import FederalIndex from "./pages/FederalTrain";
import TrainingRecord from "./pages/TrainingRecord";
import Training from "./pages/Training";
import TrainingDetails from "./pages/Training/Detail";
import FederalDetailAll from "./pages/FederalDetail";
import DataSource from "./pages/DataSource";
import Avatar from "antd/es/avatar/avatar";
import {
  BoxPlotOutlined,
  DesktopOutlined,
  DotChartOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FileDoneOutlined,
  HeatMapOutlined,
  HistoryOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Reasoning from "./pages/Reasoning";
import axios from "axios";
import api from "./config/api";
import SubMenu from "antd/es/menu/SubMenu";
import Sider from "antd/es/layout/Sider";
import Demo from "./util/demo";
const { Panel } = Collapse;

const { Header, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "1",
      party_name: "",
      party_id: 0,
      inlineCollapsed: true,
    };
    // FIXME 目前使用pubsub.js监听页面跳转然后来改变Menu的选择后续可以通过当前连接更改,目前先这么写方便测试
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
          const indexOf = party_name.indexOf("guest");
          if (indexOf === -1) {
            localStorage.setItem("role", "host");
          } else {
            localStorage.setItem("role", "guest");
          }
          console.log(localStorage.getItem("role"));
          this.setState({
            party_name,
            party_id,
          });
        }
      })
      .catch((r) => {
        message.error("链接服务器失败请重试");
        localStorage.setItem("role", null);
      });
  }

  setVisFalse = () => {
    this.setState({
      inlineCollapsed: !this.state.inlineCollapsed,
    });
  };

  render() {
    const fontStyle = {
      fontWeight: 900,
      color: "rgb(127,125,142)",
    };
    const fontStyleMenu = {
      fontWeight: 900,

      color: "rgb(127,125,142)",
    };
    const linkStyle = {
      activeStyle: {
        userSelect: "none",
        fontWeight: 900,
        color: "rgb(246,246,246)",
      },
      style: {
        userSelect: "none",
        fontWeight: 500,
        color: "rgb(246,246,246)",
      },
    };
    const headerHigh = "20px";
    const headerLine = "53.5px";
    const menuLine = "56.5px";
    const headerColor = "rgba(22,81,170)";
    const menu = (
      <div className="user-login-extend" style={{ background: "white" }}>
        <div style={fontStyle}>ID: {this.state.party_id}</div>
        {/*<div style={fontStyle}>用户名: {this.state.party_name}</div>*/}
      </div>
    );
    console.log(this.state.inlineCollapsed);
    return (
      <div>
        <Layout className="layout">
          <Header
            style={{
              background: "rgb(22,81,170)",
              padding: 0,
              margin: 0,
              height: "50px",
              lineHeight: "50px",
            }}
          >
            <div
              style={{
                width: "300px",
                height: "100%",
                margin: "0px 0px 0px 0px",
                display: "flex",
                alignItems: "center",
                userSelect: "none",
              }}
              className="logo"
            >
              <Demo
                inlineCollapsed={this.state.inlineCollapsed}
                setVisFalse={this.setVisFalse}
              />
              <Image width={"auto"} preview={false} src={logo} />
            </div>
            <Row align={"middle"} justify={"end"}>
              <Col
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                <Dropdown placement="bottomCenter" overlay={menu}>
                  <Avatar
                    size={38}
                    icon={
                      <UserOutlined style={{ color: "rgb(250,249,248)" }} />
                    }
                  />
                </Dropdown>
              </Col>
              <Col
                style={{
                  fontWeight: 900,
                  color: "rgb(250,249,248)",
                  marginRight: "10px",
                }}
              >
                {this.state.party_name}
              </Col>
            </Row>
          </Header>
          <Layout>
            <Sider
              collapsed={this.state.inlineCollapsed}
              style={{ background: "#fff" }}
            >
              <Menu
                mode="inline"
                selectedKeys={[this.state.page]}
                onSelect={(info) => {
                  this.setState({
                    page: info.key,
                  });
                }}
              >
                <Menu.Item key="1" icon={<DotChartOutlined />}>
                  <NavLink to="/federalTrain">联邦训练</NavLink>
                </Menu.Item>
                <Menu.Item key="2" icon={<HeatMapOutlined />}>
                  <NavLink to="/normal">联邦攻防</NavLink>
                </Menu.Item>
                <Menu.Item key="3" icon={<BoxPlotOutlined />}>
                  <NavLink to="/federal">联邦攻击</NavLink>
                </Menu.Item>
                <SubMenu
                  title="在线推理"
                  selectable={false}
                  key="15"
                  icon={<EditOutlined />}
                >
                  {localStorage.getItem("role") === "guest" ? (
                    <>
                      <Menu.Item key="8">
                        <NavLink to="/reasoning/model">模型部署</NavLink>
                      </Menu.Item>
                      <Menu.Item key="9">
                        <NavLink to="/reasoning/interface">单例预测</NavLink>
                      </Menu.Item>
                      <Menu.Item key="10">
                        <NavLink to="/reasoning/batch_interface">
                          批量预测
                        </NavLink>
                      </Menu.Item>
                    </>
                  ) : (
                    <Menu.Item key="12">
                      <NavLink
                        style={{
                          fontWeight: 900,
                          color: "rgb(127,125,142)",
                        }}
                        to="/reasoning/upload_data"
                      >
                        数据上传
                      </NavLink>
                    </Menu.Item>
                  )}
                </SubMenu>
                {/**/}
                <Menu.Item
                  style={{ float: "right" }}
                  key="6"
                  icon={<FileDoneOutlined />}
                >
                  <NavLink to="/datasource">数据集</NavLink>
                </Menu.Item>
                <Menu.Item
                  style={{ float: "right" }}
                  key="5"
                  icon={<FieldTimeOutlined />}
                >
                  <NavLink to="/training">正在训练</NavLink>
                </Menu.Item>
                <Menu.Item
                  style={{ float: "right" }}
                  key="4"
                  icon={<HistoryOutlined />}
                >
                  <NavLink to="/trainingRecord">训练记录</NavLink>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content style={{ padding: "3.5vh 3vw", background: "#FAF9F8" }}>
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
        </Layout>
      </div>
    );
  }
}

export default App;
