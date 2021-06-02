import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
require("./setupProxy");

ReactDOM.render(
  <BrowserRouter>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
