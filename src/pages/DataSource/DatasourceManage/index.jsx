import React, { Component } from "react";
import { Button, Table } from "antd";
import Modal from "antd/es/modal/Modal";
import DataSourceUpload from "./dataSourceUpload";
import DataSourceTable from "./dataSourceTable";
import PubSubJS from "pubsub-js";

class DataSourceAdministration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    PubSubJS.publish("datasourcePage", { page: "1" });
  }

  render() {
    const { visible } = this.state;
    return (
      <div>
        <h2 className="colorWhite">数据源管理</h2>
        <Button
          style={{ margin: "1vh 0" }}
          onClick={() => {
            this.setState({
              visible: true,
            });
          }}
        >
          上传数据源
        </Button>
        <DataSourceTable />
        <Modal
          visible={visible}
          title="上传数据集"
          centered
          footer={null}
          width={"80vw"}
          onOk={() => {
            this.setState({
              visible: true,
            });
          }}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          <DataSourceUpload />
        </Modal>
      </div>
    );
  }
}

export default DataSourceAdministration;
