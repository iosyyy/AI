import React, { Component } from "react";
import { Table } from "antd";
import Mock from "mockjs";
import DataSourceUpload from "./dataSourceUpload";
import Modal from "antd/es/modal/Modal";
import DatasourceFormHandle from "../DatasourceHandle/datasourceFormHandle";

class DataSourceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onShowDetail: {},
      dataSource: [],
      detailVisible: false,
    };
  }

  componentDidMount() {
    const { dataSource } = Mock.mock({
      "dataSource|10": [
        {
          "key|+1": 1,
          "tableName|+1": ["横向联邦", "纵向联邦"],
          "dataTableCode|+1": "code",
          "namespace|+1": ["namespace", "namespaceTwo"], // 生成随机中文名字
          "note|+1": "@cname()", // 生成随机时间戳
          "action|+1": ["delete", "retry", "add"],
        },
      ],
    });
    this.setState({
      dataSource,
    });
  }

  render() {
    const columns = [
      {
        title: <div>key</div>,
        dataIndex: "key",
        key: "key",
      },
      {
        title: <div>数据表代码</div>,
        dataIndex: "dataTableCode",
        key: "dataTableCode",
      },
      {
        title: <div>数据表代码</div>,
        dataIndex: "tableName",
        key: "tableName",
      },
      {
        title: <div>命名空间</div>,
        dataIndex: "namespace",
        key: "namespace",
      },
      {
        title: <div>备注</div>,
        dataIndex: "note",
        key: "note",
      },
      {
        title: <div>操作</div>,
        dataIndex: "action",
        key: "action",
        render: (action, obj, value) => {
          return (
            <div>
              <a
                onClick={() => {
                  console.log(obj);
                  this.setState({
                    onShowDetail: obj,
                    detailVisible: true,
                  });
                }}
              >
                查看
              </a>
              /<a>删除</a>
            </div>
          );
        },
      },
    ];
    const { dataSource, detailVisible, onShowDetail } = this.state;
    return (
      <>
        <Table
          bordered
          size="middle"
          Pagination={{ simple: true }}
          dataSource={dataSource}
          columns={columns}
        />
        <Modal
          visible={detailVisible}
          title="上传数据集"
          centered
          bodyStyle={{
            WebkitBoxShadow: "0 20px 15px #9B7468",
            MozBoxShadow: "0 20px 15px #9B7468",
            boxShadow: "0 6px 10px rgb(158,199,210)",
            borderRadius: "5px",
          }}
          wrapClassName={"site-layout-content"}
          footer={null}
          width={"90vw"}
          onOk={() => {
            this.setState({
              detailVisible: true,
            });
          }}
          onCancel={() => {
            this.setState({
              detailVisible: false,
            });
          }}
        >
          <DatasourceFormHandle
            formData={onShowDetail}
            disabled={true}
            getFormData={(data) => {}}
          />
        </Modal>
      </>
    );
  }
}

export default DataSourceTable;
