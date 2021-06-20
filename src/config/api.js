import pack from "../../package.json";
//本地代理（代理需要在setupProxy.js中配置）
const host = window.location.origin;
let baseHost = window.location.origin;
let ws;
if (pack.env === "build") {
  ws = `ws://${window.location.hostname}:${window.location.port}`;
  baseHost = window.location.origin;
} else {
  ws = `ws://8.136.225.205:8080`;
  baseHost = window.location.origin + "/api";
}

const e = {
  pageList: host + "/job/query/page/new", // 详情界面url
  showList: ws + "/websocket/progress/{jobId}/{role}/{partyId}",
  showDetailMetrics: host + "/v1/tracking/component/metrics",
  showDetailOutputModel: host + "/v1/tracking/component/output/model",
  showDetailParameters: host + "/v1/tracking/component/parameters",
  taskUpload: baseHost + "/v1/client/upload",
  beginTrain: baseHost + "/v1/client/submit/job",
  isTrainingDetail: host + "/job/query/status",
  logDetail: ws + "/log/new/{id}/{role}/{partyId}/default",
  jobUpdate: host + "/job/update",
  downloadTemplate: baseHost + "/v1/client/download/template",
  stopJob: host + "/job/v1/pipeline/job/stop",
  getJobOutput: host + "/v1/tracking/component/output/model",
  metrics: host + "/v1/tracking/component/metrics",
  metrics_data: host + "/v1/tracking/component/metric_data",
  data_output: host + "/v1/tracking/component/output/data",
  log: ws + "/log/new/{id}/{role}/{partyId}/{name}",
  batch: host + "/v1/tracking/component/metric_data/batch",
  datasourceList: baseHost + "/v1/preprocess/data/list",
};

export default e;
