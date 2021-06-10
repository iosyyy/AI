import React, { Component } from "react";
import { Button, Table } from "antd";
import Modal from "antd/es/modal/Modal";
import DataSourceUpload from "./dataSourceUpload";
import DataSourceTable from "./dataSourceTable";

class DataSourceAdministration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    const { visible } = this.state;
    return (
      <div
        style={{ overflow: "auto", height: "83vh", width: "83vw" }}
        className="site-layout-content"
      >
        <h2>数据源管理</h2>
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
          bodyStyle={{
            WebkitBoxShadow: "0 20px 15px #9B7468",
            MozBoxShadow: "0 20px 15px #9B7468",
            boxShadow: "0 6px 10px rgb(158,199,210)",
          }}
          wrapClassName={"site-layout-content"}
          footer={null}
          width={"90vw"}
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
