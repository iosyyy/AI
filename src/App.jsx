import React from "react";
import { Layout, Menu } from "antd";
import { Route, NavLink, Switch, Redirect } from "react-router-dom";
import Normal from "./pages/Normal";
import Federal from "./pages/Federal";

import "./App.css";
import "antd/dist/antd.css";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <NavLink to="/normal">普通训练</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
              <NavLink to="/federal">联邦训练</NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "50px 50px" }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/normal" component={Normal} />
              <Route path="/federal" component={Federal} />
              <Redirect to="/normal" />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          AI Demo ©2021 Created by Hrbust Science and Technology University
        </Footer>
      </Layout>
      ,
    </div>
  );
}
export default App;
