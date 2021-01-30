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
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">
              <NavLink to="/normal">普通訓練</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
              <NavLink to="/federal">聯邦訓練</NavLink>
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
          AI Demo ©2021 Created by Hrbust
        </Footer>
      </Layout>
    </div>
  );
}
export default App;
