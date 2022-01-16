import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import App from "./App";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Login from "./pages/Login";

require("./setupProxy");

ReactDOM.render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <DndProvider backend={HTML5Backend}>
        <Switch>
          <Route path="/home" component={Login} />
          <Route path="/" component={App} />
          <Redirect to="/home" />
        </Switch>
      </DndProvider>
    </ConfigProvider>
  </HashRouter>,
  document.getElementById("root")
);
