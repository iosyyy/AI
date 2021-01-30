import React from "react";
import { Layout, Menu } from "antd";
import { Route, NavLink, Switch,Redirect } from "react-router-dom";
import NormalTrain from './pages/NormalTrain'
import FederalTrain from './pages/FederalTrain'

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
              <Route path="/normal" component={NormalTrain}></Route>
              <Route path="/federal" component={FederalTrain}></Route>
            <Redirect to="normal"></Redirect>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          AI Demo ©2021 Created by Hrbust Science and Technology University
        </Footer>
      </Layout>
    </div>
  );
}
export default App;
