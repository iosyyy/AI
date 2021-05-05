//本地代理（代理需要在setupProxy.js中配置）
const host = "http://localhost:3000";
const api1 = "/api1";

const e = {
  normalTrain: host + api1 + "/base/train/",
  federalTrain: host + api1 + "/fed/service/",
  host,
  serverSocketIp: "http://localhost:8080",
  pageList: "http://127.0.0.1:8080/job/query/page/new",
};

export default e;
