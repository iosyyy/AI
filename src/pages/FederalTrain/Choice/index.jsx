import React, { Component } from "react";
import axios from "axios";
import api from "../../../config/api";
import FileSaver from "file-saver";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import StepsTemplate from "../../../components/StepsTemplate";
import AdvancedForm from "./advancedForm";
import NormalForm from "./normalForm";

class FederalTrainChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdvancedConfiguration: false,
    };
  }

  changeForm = () => {
    this.setState(state => ({
      showAdvancedConfiguration: !state.showAdvancedConfiguration,
    }));
  };

  downloadTempalte(fileName) {
    axios
      .post(api.downloadTemplate, {
        file_name: fileName,
      })
      .then(f => {
        let jsonObj = f.data;
        let jsonStr = JSON.stringify(jsonObj, null, "  ");
        let file = new Blob([jsonStr], { type: "" });
        FileSaver.saveAs(file, fileName + ".json");
      });
  }

  render() {
    return (
      <div style={{ height: "80vh" }} className="site-layout-content">
        <StepsTemplate
          steps={[
            { status: "finish", title: "联邦类型", icon: <FileOutlined /> },
            {
              status: "finish",
              title: "数据上传",
              icon: <CloudUploadOutlined />,
            },
            {
              status: "process",
              title: "参数配置",
              icon: <DownloadOutlined />,
            },
          ]}
        />
        {this.state.showAdvancedConfiguration
          ? <AdvancedForm
              changeForm={() => {
                this.changeForm();
              }}
            />
          : <NormalForm
              changeForm={() => {
                this.changeForm();
              }}
            />}
      </div>
    );
  }
}

export default FederalTrainChoice;
