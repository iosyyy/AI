import LossOutput from "../pages/FederalDetail/detailComponents/lossOutput";
import FederalDetailOutput from "../pages/FederalDetail/detailComponents/output";
import Log from "../pages/FederalDetail/detailComponents/log";
import Summary from "../pages/FederalDetail/detailComponents/summary";
import BoostModelOutput from "../pages/FederalDetail/detailComponents/boostModelOutput";
import SummaryBatchDataSplit from "../pages/FederalDetail/detailComponents/summaryDataSplit";
import Metrics from "../pages/FederalDetail/detailComponents/metrics";
import ModelOutput from "../pages/FederalDetail/detailComponents/modelOutput";
import SummaryBatch from "../pages/FederalDetail/detailComponents/summaryBatch";

export default function getFederalDeatilCom(
  namew,
  metrics,
  metric_namespace,
  metric_name,
  post_data,
  model
) {
  let names;
  switch (namew) {
    // 这里通过metric_namespace选择不同的tabs
    case "HeteroNN":
      names = [
        {
          name: "model output",
          component: (
            <LossOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
              metrics={metrics}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    case "Intersection":
      names = [
        {
          name: "summary",
          component: (
            <Summary
              key={generateUUID()}
              model={model}
              post_data={post_data}
              metric_name={metric_name}
              metric_namespace={metric_namespace}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    case "HomoSecureboost":
    case "HeteroSecureBoost":
      names = [
        {
          name: "model output",
          component: (
            <BoostModelOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
              metrics={metrics}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    case "HomoDataSplit":
      names = [
        {
          name: "summary",
          component: (
            <SummaryBatchDataSplit
              key={generateUUID()}
              metric_name={metric_name}
              metric_namespace={metric_namespace}
              model={model}
              post_data={post_data}
              metrics={metrics}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    case "Upload":
      names = [
        {
          name: "summary",
          component: (
            <Summary
              key={generateUUID()}
              model={model}
              post_data={post_data}
              metric_name={metric_name}
              metric_namespace={metric_namespace}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    case "Evaluation":
      names = [
        {
          name: "metrics",
          component: (
            <Metrics
              key={generateUUID()}
              model={model}
              metrics={metrics}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    case "HomoLR":
      names = [
        {
          name: "model output",
          component: (
            <ModelOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
              metrics={metrics}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    case "Reader":
      names = [
        {
          name: "summary",
          component: (
            <SummaryBatch
              key={generateUUID()}
              metric_name={metric_name}
              metric_namespace={metric_namespace}
              model={model}
              post_data={post_data}
              metrics={metrics}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];
      break;
    default:
      names = [
        {
          name: "summary",
          component: (
            <SummaryBatch
              key={generateUUID()}
              metric_name={metric_name}
              metric_namespace={metric_namespace}
              model={model}
              post_data={post_data}
              metrics={metrics}
            />
          ),
        },
        {
          name: "data output",
          component: (
            <FederalDetailOutput
              key={generateUUID()}
              model={model}
              post_data={post_data}
            />
          ),
        },
        {
          name: "log",
          component: (
            <Log key={generateUUID()} model={model} post_data={post_data} />
          ),
        },
      ];

      break;
  }

  return names;
}

function generateUUID() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
