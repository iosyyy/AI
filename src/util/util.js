import io from "socket.io-client";
import api from "../config/api";

const { host,_normalTrain,_federalTrain } = api;

// 普通训练
openListenByNormal = (data) => {
  //绑定接口
  let socket = io(host);
  //提交开始训练信号
  socket.emit(_normalTrain,{data});
  //监听数据
  socket.on(_federalTrain,  (data) => {
    //这里用得到的数据来绑定数据修改页面
  });
};

// 联邦训练
openListenByFederal = (data) => {
     //绑定接口
  let socket = io(host);
  //提交开始训练信号
  socket.emit(_normalTrain,{data});
  //监听数据
  socket.on(_federalTrain,  (data) => {
    //这里用得到的数据来绑定数据修改页面
  });
};