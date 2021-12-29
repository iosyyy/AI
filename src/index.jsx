import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

require("./setupProxy");

ReactDOM.render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </ConfigProvider>
  </HashRouter>,
  document.getElementById("root")
);
