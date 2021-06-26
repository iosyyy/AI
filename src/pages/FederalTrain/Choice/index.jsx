import React, { Component } from "react";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";
import AdvancedForm from "./advancedForm";
import NormalForm from "./normalForm";

class FederalTrainChoice extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.history.location.state);
    this.state = {
      showAdvancedConfiguration: false,
      loading: false,
    };
  }

  changeForm = () => {
    this.setState((state) => ({
      showAdvancedConfiguration: !state.showAdvancedConfiguration,
    }));
  };

  setLoading = (loading) => {
    this.setState({
      loading,
    });
  };

  render() {
    const { loading } = this.state;

    return (
      <div style={{ height: "80vh" }} className="site-layout-content">
        <StepsTemplate
          steps={[
            { status: "finish", title: "联邦类型", icon: <FileOutlined /> },
            {
              status: "finish",
              title: "任务参与方选择",
              icon: <CloudUploadOutlined />,
            },
            {
              status: "process",
              title: "参数配置",
              icon: loading ? <LoadingOutlined /> : <DownloadOutlined />,
            },
          ]}
        />
        {this.state.showAdvancedConfiguration ? (
          <AdvancedForm
            setLoading={this.setLoading}
            changeForm={() => {
              this.changeForm();
            }}
          />
        ) : (
          <NormalForm
            setLoading={this.setLoading}
            changeForm={() => {
              this.changeForm();
            }}
          />
        )}
      </div>
    );
  }
}

export default FederalTrainChoice;
