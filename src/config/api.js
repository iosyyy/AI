//本地代理（代理需要在setupProxy.js中配置）
const host = window.location.origin;
let baseHost;
let ws;
let fateBoardWs;
if (process.env.ENVIRONMENT === "build") {
  ws = `ws://${window.location.hostname}:${window.location.port}`;
  fateBoardWs = `ws://${window.location.hostname}:${window.location.port}`;
  baseHost = window.location.origin;
} else {
  ws = `ws://1.117.24.151:8080`;
  baseHost = window.location.origin + "/api";
  fateBoardWs = `ws://${window.location.hostname}:8080`;
}

const e = {
  pageList: host + "/job/query/page/new", // 详情界面url
  jobList: host + "/v1/intersection/list/job/intersection",
  dTree: host + "/v1/preprocess/data/d_tree",
  showList: ws + "/websocket/progress/{jobId}/{role}/{partyId}",
  showDetailMetrics: host + "/v1/tracking/component/metrics",
  showDetailOutputModel: host + "/v1/tracking/component/output/model",
  showDetailParameters: host + "/v1/tracking/component/parameters",
  taskUpload: host + "/v1/client/upload",
  beginHighTrain: host + "/v1/client/submit/job/high",
  beginNormalTrain: host + "/v1/client/submit/job/general",
  isTrainingDetail: host + "/job/query/status",
  logDetail: ws + "/log/new/{id}/{role}/{partyId}/default",
  jobUpdate: host + "/job/update",
  modelUpdate: host + "/v1/deploy/grpc/create",
  single: host + "/v1/predict/single",
  batchSingle: host + "/v1/predict/batch",
  downloadTemplate: host + "/v1/client/download/template",
  uploadFile: host + "/v1/predict_data/upload_file",
  updateFile: host + "/v1/predict_data/update_file",
  submitJob: host + "/v1/intersection/submit/job/intersection",
  stopJob: host + "/job/v1/pipeline/job/stop",
  getJobOutput: host + "/v1/tracking/component/output/model",
  findList: host + "/v1/predict_data/predict/find_list",
  findConditionList: host + "/v1/predict_data/predict/condition_list",
  findPredict: host + "/v1/predict/list",
  findDeployListStatus1: host + "/v1/deploy/find_deploy_list?status=1",
  findDeploy: host + "/v1/deploy/find_list",
  findDeployConditionList: host + "/v1/deploy/deploy/condition_list",
  delPredict: host + "/v1/predict_data/predict/del",
  delPredictBatch: host + "/v1/predict/delete",
  delDeploy: host + "/v1/deploy/grpc/del",
  updateStatus: host + "/v1/deploy/grpc/update_status",
  metrics: host + "/v1/tracking/component/metrics",
  metrics_data: host + "/v1/tracking/component/metric_data",
  data_output: host + "/v1/tracking/component/output/data",
  log: ws + "/log/new/{id}/{role}/{partyId}/{name}",
  batch: host + "/v1/tracking/component/metric_data/batch",
  datasourceList: host + "/v1/preprocess/data/list",
  queryDatasource: host + "/v1/preprocess/data/find",
  delDatasource: host + "/v1/preprocess/data/del",
  preprocess: host + "/v1/preprocess/data/preprocess",
  getClientInfo: host + "/v1/client/info",
  getPreprocess: host + "/v1/preprocess/data_find",
  getZhiFang: host + "/v1/preprocess/data/hist",
  getReLi: host + "/v1/preprocess/data/heatmap",
  getSanDian: host + "/v1/preprocess/data/dotmap",
  getKmeans: host + "/v1/preprocess/data/cluster_data",
  hostStatus: ws + "/websocket/deploy/status/host",
  guestStatus: ws + "/websocket/deploy/status/guest",
  downloadIntroduction: host + "/v1/client/download/conf_params"
};

export default e;
