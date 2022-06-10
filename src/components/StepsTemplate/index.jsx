import React, { Component } from "react";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";

const { Step } = Steps;
class StepsTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { steps, current } = this.props;
    return (
      <Steps current={current} style={{ marginBottom: "1  vh" }}>
        {steps.map((v, i) => {
          return (
            <Step key={i} status={v.status} title={v.title} icon={v.icon} />
          );
        })}
      </Steps>
    );
  }
}

export default StepsTemplate;
