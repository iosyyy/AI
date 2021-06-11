import React, { Component } from "react";
import { Button, Divider, Select, Space, Table } from "antd";
import Mock from "mockjs";
import DataSourceUpload from "./dataSourceUpload";
import Modal from "antd/es/modal/Modal";
import DatasourceFormHandle from "../DatasourceHandle/datasourceFormHandle";
import { Option } from "antd/es/mentions";

const COLUMNS = [
  {
    title: "",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => {
      return <h1>{index}</h1>;
    },
    width: "5vw",
  },
  {
    title: "字段标签",
    dataIndex: "fieldLabel",
    key: "fieldLabel",
    width: "10vw",
  },
  {
    title: "字段名称",
    dataIndex: "fieldName",
    key: "fieldName",
    width: "10vw",
  },
  {
    title: "字段类型",
    dataIndex: "fieldType",
    key: "fieldType",
    render: (text, record, index) => {
      return (
        <Select defaultValue="id">
          <Option value="id">唯一标识(ID)</Option>
          <Option value="integer">数值型变量</Option>
          <Option value="type">分类型变量</Option>
        </Select>
      );
    },
    width: "10vw",
  },
  {
    title: "是否使用",
    dataIndex: "use",
    key: "use",
    render: (text, record, index) => {
      return (
        <Select defaultValue="yes">
          <Option value="yes">是</Option>
          <Option value="no">否</Option>
        </Select>
      );
    },
    width: "10vw",
  },
  {
    title: "标签(分类)Map (哑变量处理)",
    dataIndex: "map",
    key: "map",
    width: "10vw",
  },
];

class DataSourceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onShowDetail: {},
      detailVisible: false,
      dataSource: [],
      dataSource2: [
        {
          key: "1",
          fieldLabel: "...",
          fieldName: "...",
          map: "",
        },
        {
          key: "2",
          fieldLabel: "...",
          fieldName: "...",
          map: "",
        },
        {
          key: "3",
          fieldLabel: "...",
          fieldName: "...",
          map: "",
        },
        {
          key: "4",
          fieldLabel: "...",
          fieldName: "...",
          map: "",
        },
        {
          key: "5",
          fieldLabel: "...",
          fieldName: "...",
          map: "",
        },
      ],
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
    const { dataSource2, dataSource, detailVisible, onShowDetail } = this.state;

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
          title="已处理数据详情页"
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
          <Divider orientation="left">
            <h3 style={{ color: "rgb(93,176,215)" }}>基本信息</h3>
          </Divider>
          <DatasourceFormHandle
            formData={onShowDetail}
            disabled={true}
            getFormData={(data) => {}}
          />
          <Divider orientation="left">
            <h3 style={{ color: "rgb(93,176,215)" }}>数据预处理字段规则定义</h3>
          </Divider>
          <div>
            <Table
              style={{ marginLeft: "3vw", marginRight: "2vw" }}
              dataSource={dataSource2}
              columns={COLUMNS}
              bordered
              size="small"
              pagination={false}
            />
          </div>
        </Modal>
      </>
    );
  }
}

export default DataSourceTable;
