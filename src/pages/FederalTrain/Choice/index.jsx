import React, { Component } from "react";
import axios from "axios";
import api from "../../../config/api";
import FileSaver from "file-saver";
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

  downloadTempalte(fileName) {
    axios
      .post(api.downloadTemplate, {
        file_name: fileName,
      })
      .then((f) => {
        let jsonObj = f.data;
        let jsonStr = JSON.stringify(jsonObj, null, "  ");
        let file = new Blob([jsonStr], { type: "" });
        FileSaver.saveAs(file, fileName + ".json");
      });
  }

  render() {
    const { loading } = this.state;

    return (
      <div style={{ height: "80vh" }} className="site-layout-content">
        <StepsTemplate
          steps={[
            { status: "finish", title: "联邦类型", icon: <FileOutlined /> },
            {
              status: "finish",
              title: "数据集选择",
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
