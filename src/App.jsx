import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  Input,
  Layout,
  Menu,
  Modal,
  Popover,
  Row,
  Space,
  Upload,
} from "antd";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import moment from "moment";
import {
  AlertOutlined,
  BookOutlined,
  BoxPlotOutlined,
  BranchesOutlined,
  createFromIconfontCN,
  DotChartOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FileDoneOutlined,
  HeatMapOutlined,
  HistoryOutlined,
  PieChartOutlined,
  SettingOutlined,
  UploadOutlined,
  UserSwitchOutlined,
  UserOutlined,
  ToolOutlined,
  MehOutlined,
} from "@ant-design/icons";
import PubSubJS from "pubsub-js";
import Normal from "./pages/Normal";
import Federal from "./pages/Federal";
import logo from "./img/logolast.png";
import star from "./img/starWhite.png";
import "./App.css";
import "antd/dist/antd.css";
import FederalIndex from "./pages/FederalTrain";
import TrainingRecord from "./pages/TrainingRecord";
import Training from "./pages/Training";
import TrainingDetails from "./pages/Training/Detail";
import FederalDetailAll from "./pages/FederalDetail";
import DataSource from "./pages/DataSource";
import Avatar from "antd/es/avatar/avatar";
import Reasoning from "./pages/Reasoning";
import SubMenu from "antd/es/menu/SubMenu";
import Sider from "antd/es/layout/Sider";
import MenuButton from "./util/menuButton";
import JointStatement from "./pages/JointStatement";
import { message } from "antd";
import { white } from "mockjs/src/mock/random/color_dict";
import api from "./config/api";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import ModalUpdate from "./pages/NotifyReasoning/ModalUpdate";
import ModalGet from "./pages/NotifyReasoning/ModalGet";
import UserInfo from "./pages/UserInfo";

const { Header, Content } = Layout;
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1749581_s16tzbduh78.js",
});
function checkF() {
  // 检查是否登陆过期
  return (
    localStorage.getItem("userLogin") &&
    localStorage.getItem("LOGIN_FLAG") &&
    Number(localStorage.getItem("LOGIN_FLAG")) < new Date().getTime()
  );
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "1",
      party_name: "",
      party_id: 0,
      inlineCollapsed: true,
      count: 0,
      status: [],
      datasource: [],
      show: false,
      selectId: {
        service_id: "",
      },
      loading: false,
      modalShow: false,
      clicked: false,
    };

    // request拦截器

    // FIXME 目前使用PubSubJS.js监听页面跳转然后来改变Menu的选择后续可以通过当前连接更改,目前先这么写方便测试
    PubSubJS.subscribe("isRunning", (msg, data) => {
      this.setState({ page: data.page });
    });
  }

  componentDidMount() {
    if (localStorage.getItem("userLogin")) {
      if (checkF()) {
        this.props.history.push("/home");
        console.log(Number(localStorage.getItem("LOGIN_FLAG")));
        console.log(new Date().getTime());
        message.error("登录超时请重试");
        localStorage.setItem("role", null);
        localStorage.setItem("username", null);
        localStorage.setItem("party_name", null);
        localStorage.setItem("party_id", null);
        localStorage.setItem("userLogin", null);
        localStorage.setItem("account", null);
        localStorage.setItem("nickname", null);
        localStorage.setItem("id", null);
        localStorage.setItem("LOGIN_FLAG", null);
      }
      let socket = new WebSocket(
        localStorage.getItem("role") !== "guest"
          ? api.hostStatus
          : api.guestStatus
      );
      socket.onmessage = (data) => {
        let detail = JSON.parse(data.data);

        this.setState({
          count: detail.total,
          datasource: detail.data,
        });
      };
    } else {
      this.props.history.push("/home");
    }
  }

  upload = (id) => {
    this.setState({
      selectId: {
        service_id: id,
      },
      clicked: false,
    });
    this.setShow(true);
  };

  modelUpload = (id) => {
    this.setState({
      selectId: {
        service_id: id,
      },
      clicked: false,
    });
    this.setModalShow(true);
  };

  setLoadingAndShow = (loading, show) => {
    this.setState({
      loading,
      show,
    });
  };

  setModalLoadingAndShow = (loading, modalShow) => {
    this.setState({
      loading,
      modalShow,
    });
  };

  setShow = (show) => {
    this.setState({
      show,
    });
  };
  setModalShow = (modalShow) => {
    this.setState({
      modalShow,
    });
  };

  setVisFalse = () => {
    this.setState({
      inlineCollapsed: !this.state.inlineCollapsed,
    });
  };

  exit = () => {
    this.props.history.push({
      pathname: "/home",
    });
  };

  render() {
    const fontStyle = {
      fontWeight: 900,
      color: "rgb(127,125,142)",
    };
    const { show, selectId, loading, clicked, modalShow } = this.state;

    const userLogin = !localStorage.getItem("userLogin");
    const menu = (
      <div className="user-login-extend" style={{ background: "white" }}>
        <div style={{ ...fontStyle, marginBottom: "0.5vh" }}>
          ID: {localStorage.getItem("party_id")}
        </div>
        <Button onClick={this.exit}>退出登录</Button>
      </div>
    );

    let role = localStorage.getItem("role") !== "guest";
    const content = (
      <div style={{ ...fontStyle, maxHeight: "40vh", overflow: "scroll" }}>
        {this.state.count !== 0
          ? this.state.datasource.map((item, index) => {
              let time = new Date(item.f_create_date * 1000);
              return (
                <Card
                  key={index}
                  hoverable
                  onClick={() => {
                    if (role) {
                      this.upload(item.f_service_id);
                    } else {
                      this.modelUpload(item.f_service_id);
                    }
                  }}
                  style={{ margin: "1vh" }}
                  size="small"
                >
                  <Row>
                    {role
                      ? `请上传service_id为${item.f_service_id}对应的预测文件`
                      : `参与方已上传关于service_id为${item.f_service_id}的对应预测文件`}
                  </Row>
                  <Row justify="end">
                    <span style={{ color: "grey" }}>
                      {time.toLocaleString()}
                    </span>
                  </Row>
                </Card>
              );
            })
          : "暂无信息"}
      </div>
    );
    const isGuest = localStorage.getItem("role") === "guest";
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
                width: "349px",
                height: "100%",
                margin: "0px 0px 0px 0px",
                display: "flex",
                alignItems: "center",
                userSelect: "none",
              }}
              className="logo"
            >
              <MenuButton
                inlineCollapsed={this.state.inlineCollapsed}
                setVisFalse={this.setVisFalse}
              />
              <Image width={"90px"} preview={false} src={star} />
              <Image width={"auto"} preview={false} src={logo} />
            </div>
            <Row align={"middle"} justify={"end"}>
              <Col
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                <Popover
                  onVisibleChange={(visible) => {
                    this.setState({
                      clicked: visible,
                    });
                  }}
                  visible={clicked}
                  placement="bottomRight"
                  content={content}
                >
                  <Badge
                    style={{
                      marginRight: "15px",
                      backgroundColor: "#52c41a",
                    }}
                    count={this.state.count}
                    size="small"
                  >
                    <AlertOutlined
                      style={{
                        marginRight: "15px",
                        color: "white",
                        fontSize: 20,
                      }}
                    />
                  </Badge>
                </Popover>
                <Dropdown placement="bottomCenter" overlay={menu}>
                  <Avatar
                    className={isGuest ? "guestBack" : "hostBack"}
                    style={{
                      color: "rgb(249,248,248)",
                      userSelect: "none",
                    }}
                    size={38}
                    // icon={<IconFont type={"icon-xuesheng"} />}
                  >
                    {localStorage.getItem("username")}
                  </Avatar>
                </Dropdown>
              </Col>
              <Col
                style={{
                  fontWeight: 900,
                  color: "rgb(250,249,248)",
                  marginRight: "10px",
                  userSelect: "none",
                }}
              >
                {localStorage.getItem("nickname")}
              </Col>
            </Row>
          </Header>
          <Layout>
            {userLogin ? (
              <></>
            ) : (
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

                  <SubMenu
                    title="在线推理"
                    selectable={false}
                    key="15"
                    icon={<EditOutlined />}
                  >
                    {isGuest ? (
                      <>
                        <Menu.Item
                          icon={<IconFont type={"icon-xingkong"} />}
                          key="8"
                        >
                          <NavLink to="/reasoning/model">模型部署记录</NavLink>
                        </Menu.Item>
                        {/* <Menu.Item
                          icon={
                            <IconFont type={"icon-dc-icon-zhongzidujiaoshou"} />
                          }
                          key="9"
                        >
                          <NavLink to="/reasoning/interface">单例预测</NavLink>
                        </Menu.Item> */}

                        <Menu.Item
                          icon={<IconFont type={"icon-icon"} />}
                          key="10"
                        >
                          <NavLink to="/reasoning/batch_interface">
                            批量预测记录
                          </NavLink>
                        </Menu.Item>
                      </>
                    ) : (
                      <>
                        <Menu.Item
                          icon={<IconFont type={"icon-xingkong"} />}
                          key="30"
                        >
                          <NavLink to="/reasoning/modelTable">部署记录</NavLink>
                        </Menu.Item>
                        <Menu.Item
                          icon={<IconFont type={"icon-Upload"} />}
                          key="12"
                        >
                          <NavLink to="/reasoning/upload_data">
                            数据上传
                          </NavLink>
                        </Menu.Item>
                      </>
                    )}
                  </SubMenu>

                  <SubMenu
                    title="数据集"
                    selectable={false}
                    key="16"
                    icon={<FileDoneOutlined />}
                  >
                    <Menu.Item key="17" icon={<SettingOutlined />}>
                      <NavLink to="/datasource/datasourceManage">
                        数据源管理
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="18" icon={<UserSwitchOutlined />}>
                      <NavLink to="/datasource/myDatasource">
                        我的数据源
                      </NavLink>
                    </Menu.Item>
                  </SubMenu>

                  <SubMenu
                    title="用户信息"
                    selectable={false}
                    key="45"
                    icon={<UserOutlined />}
                  >
                    <Menu.Item key="58" icon={<MehOutlined />}>
                      <NavLink to="/userinfo/userinfo">用户信息</NavLink>
                    </Menu.Item>
                    <Menu.Item key="57" icon={<ToolOutlined />}>
                      <NavLink to="/userinfo/changepwd">修改登陆密码</NavLink>
                    </Menu.Item>
                  </SubMenu>

                  <Menu.Item key="5" icon={<FieldTimeOutlined />}>
                    <NavLink to="/training">正在训练</NavLink>
                  </Menu.Item>
                  <Menu.Item key="4" icon={<HistoryOutlined />}>
                    <NavLink to="/trainingRecord">训练记录</NavLink>
                  </Menu.Item>
                </Menu>
              </Sider>
            )}
            <Content style={{ padding: "3vh 1.5vw", background: "#FAF9F8" }}>
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
                <Route path="/jointStatement" component={JointStatement} />
                <Route path="/userinfo" component={UserInfo} />

                <Redirect to="/home" />
              </Switch>
            </Content>
          </Layout>
        </Layout>

        <ModalUpdate
          show={show}
          selectId={selectId}
          loading={loading}
          setShow={this.setShow}
          setLoadingAndShow={this.setLoadingAndShow}
          history={this.props.history}
        />

        <ModalGet
          show={modalShow}
          selectId={selectId}
          loading={loading}
          setShow={this.setModalShow}
          setLoadingAndShow={this.setModalLoadingAndShow}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default App;
