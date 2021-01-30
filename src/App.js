import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";

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
            <Menu.Item key="1">普通訓練</Menu.Item>
            <Menu.Item key="2">聯邦訓練</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">Content1</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          AI Demo ©2021 Created by Hrbust
        </Footer>
      </Layout>
      ,
    </div>
  );
}
export default App;
