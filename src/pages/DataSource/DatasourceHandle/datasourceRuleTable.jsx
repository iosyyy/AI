import React, { Component } from "react";
import { Table, Select, Button, Space } from "antd";
const { Option } = Select;

const dataSource = [
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
];

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
class DatasourceRuleTable extends Component {
  render() {
    return (
      <div>
        <Table
          style={{ marginLeft: "3vw", marginRight: "3vw" }}
          dataSource={dataSource}
          columns={COLUMNS}
          bordered
          size="small"
          pagination={false}
        />
      </div>
    );
  }
}

export default DatasourceRuleTable;
