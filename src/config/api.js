//本地代理（代理需要在setupProxy.js中配置）
const host = 'http://localhost:3000';
const api1 = '/api1';

const e = {
  normalTrain: host + api1 + '/base/train/',
  federalTrain: host + api1 + '/fed/service/',

  host,
  serverSocketIp: 'http://localhost:8080',
  pageList: 'http://127.0.0.1:8080/job/query/page/new', // 详情界面url
  showList: 'ws://127.0.0.1:8080/websocket/progress/{jobId}/{role}/{partyId}', // TODO 中间的Show组件的url这里使用websocket链接注意一下
  showDetailMetrics: 'http://127.0.0.1:8080/v1/tracking/component/metrics',
  showDetailOutputModel:
    'http://127.0.0.1:8080/v1/tracking/component/output/model',
  showDetailParameters:
    'http://127.0.0.1:8080/v1/tracking/component/parameters',
  taskUpload: 'http://localhost:3000/api/v1/client/upload',
  beginTrain: 'http://localhost:3000/api/v1/client/submit/job',
  isTrainingDetail: '/job/query/status',
  // TODO 上面三个链接是获取点击右下角按钮的详情页面,其他参数都是从上一个页面传过来的
};

export default e;
