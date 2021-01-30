//本地代理
let apiRoot = "http://127.0.0.1:3000";
let api1 = '/api1'
export default {
  normalTrain: apiRoot + api1 +"/base/train/",
  _normalTrain: "/base/train/",

  federalTrain: apiRoot + api1+ "/fed/service/",
  _federalTrain: "/fed/service/",

  host: apiRoot,
};
