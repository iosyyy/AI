import React from "react";
import { Layout, Menu } from "antd";
import { Route, NavLink, Switch, Redirect } from "react-router-dom";
import Normal from "./pages/Normal";
import Federal from "./pages/Federal";

import "./App.css";
import "antd/dist/antd.css";
import FederalIndex from "./pages/FederalTrain";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <NavLink to="/federalTrain">联邦训练</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
              <NavLink to="/normal">联邦防御</NavLink>
            </Menu.Item>
            <Menu.Item key="3">
              <NavLink to="/federal">联邦攻击</NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "50px 50px" }}>

            <Switch>
              <Route path="/federalTrain" component={FederalIndex} />
              <Route path="/normal" component={Normal} />
              <Route path="/federal" component={Federal} /> 
              <Redirect to="/federalTrain" />
            </Switch>
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
