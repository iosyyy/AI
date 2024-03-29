import api from "../config/api";

const io = require("socket.io-client");

const { serverSocketIp } = api;

// 普通训练
const openListenByNormal = (reqData, fun) => {
  // 绑定接口
  const socket = io(serverSocketIp);
  // 提交开始训练信号
  socket.emit("by normal", { reqData });
  // 监听数据
  socket.on("by normal", (info) => {
    if (info.code === 0) {
      // 这里用得到的数据来绑定数据修改页面
      fun(info);
    } else {
      console.warn(`服务器端出现错误，错误码：${info.code}`);
    }
  });
};

// 联邦训练
const openListenByFederal = (data, fun) => {
  // 绑定接口
  const socket = io(serverSocketIp);
  // 提交开始训练信号
  socket.emit("by federal", { data });
  // 监听数据
  socket.on("by federal", (info) => {
    if (info.code === 0) {
      // 这里用得到的数据来绑定数据修改页面
      fun(info);
    } else {
      console.warn(`服务器端出现错误，错误码：${info.code}`);
    }
  });
};
const fontStyle = { fontSize: "14px", fontWeight: 900, color: "#606266" };

export { openListenByNormal, openListenByFederal, fontStyle };
