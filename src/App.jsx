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
import Login from "./pages/Login";
import { white } from "mockjs/src/mock/random/color_dict";
import api from "./config/api";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

const { Header, Content } = Layout;
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1749581_s16tzbduh78.js",
});

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
      clicked: false,
    };
    // FIXME 目前使用PubSubJS.js监听页面跳转然后来改变Menu的选择后续可以通过当前连接更改,目前先这么写方便测试
    PubSubJS.subscribe("isRunning", (msg, data) => {
      this.setState({ page: data.page });
    });
  }

  componentDidMount() {
    let socket = new WebSocket(
      localStorage.getItem("role") !== "guest"
        ? api.hostStatus
        : api.guestStatus
    );
    socket.onmessage = (data) => {
      console.log(data);
      let detail = JSON.parse(data.data);
      console.log(detail);
      this.setState({
        count: detail.total,
        datasource: detail.data,
      });
    };
  }

  upload = (id) => {
    console.log(id);
    this.setState({
      selectId: {
        service_id: id,
      },
      clicked: false,
    });
    this.setShow(true);
  };

  setShow = (show) => {
    this.setState({
      show,
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
    const { show, selectId, loading, clicked } = this.state;

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
                    onClick={() => {
                      console.log(123);
                    }}
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
                {localStorage.getItem("party_name")}
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
                  <Menu.Item key="2" icon={<HeatMapOutlined />}>
                    <NavLink to="/normal">联邦攻防</NavLink>
                  </Menu.Item>
                  <Menu.Item key="3" icon={<BoxPlotOutlined />}>
                    <NavLink to="/federal">联邦攻击</NavLink>
                  </Menu.Item>
                  <SubMenu
                    title="联合报表"
                    selectable={false}
                    key="21"
                    icon={<PieChartOutlined />}
                  >
                    <Menu.Item icon={<BranchesOutlined />} key="22">
                      <NavLink to="/jointStatement/create">创建任务</NavLink>
                    </Menu.Item>
                    <Menu.Item icon={<BookOutlined />} key="23">
                      <NavLink to="/jointStatement/result">任务记录</NavLink>
                    </Menu.Item>
                  </SubMenu>
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
                        <Menu.Item
                          icon={
                            <IconFont type={"icon-dc-icon-zhongzidujiaoshou"} />
                          }
                          key="9"
                        >
                          <NavLink to="/reasoning/interface">单例预测</NavLink>
                        </Menu.Item>

                        <Menu.Item
                          icon={<IconFont type={"icon-icon"} />}
                          key="10"
                        >
                          <NavLink to="/reasoning/batch_interface">
                            批量预测
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

                <Redirect to="/home" />
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Modal
          title="数据上传"
          visible={show}
          onCancel={() => {
            this.setShow(false);
          }}
          style={{ top: 40 }}
          width={"45vw"}
          footer={null}
          destroyOnClose={true}
        >
          <Form
            initialValues={{ ...selectId }}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 24 }}
            onFinish={(e) => {
              console.log(e);
              const { service_id, context, file } = e;
              const formData = new FormData();
              formData.append("file", file.file);
              formData.append("context", context);
              formData.append("id", service_id);
              this.setState({
                loading: true,
              });
              axios
                .post(api.updateFile, formData)
                .then((r) => {
                  const { code, msg } = r.data;

                  if (code !== 0) {
                    message.error("更新失败" + msg);
                    return;
                  }
                  message.success("上传成功");
                })
                .finally(() => {
                  this.setState({
                    loading: false,
                    show: false,
                  });
                });
            }}
            layout={"vertical"}
          >
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="service_id"
                  label={<div style={fontStyle}>service_id</div>}
                  rules={[{ required: true, message: "请输入service_id" }]}
                >
                  <Input disabled placeholder={"请输入service_id"} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="file"
                  label={<div style={fontStyle}>预测样本</div>}
                  rules={[{ required: true, message: "请上传预测样本后重试" }]}
                >
                  <Upload
                    beforeUpload={() => {
                      return false;
                    }}
                    style={{ width: "10px" }}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>
                      上传预测样本 (Max: 1)
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={24}>
                <Form.Item
                  name="context"
                  label={<div style={fontStyle}>数据信息</div>}
                  rules={[{ required: true, message: "请输入数据信息" }]}
                >
                  <TextArea
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    placeholder={"请输入数据信息"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify={"end"}>
              <Space>
                <Col>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        this.setState({
                          show: false,
                        });
                      }}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      更新
                    </Button>
                  </Form.Item>
                </Col>
              </Space>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default App;
