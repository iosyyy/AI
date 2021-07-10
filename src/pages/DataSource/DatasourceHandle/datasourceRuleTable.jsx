import React, { Component } from "react";
import { Table, Select, Input, Spin, message } from "antd";
import axios from "axios";
import api from "../../../config/api";
const { Option } = Select;

class DatasourceRuleTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fieldNameArr: [],
      isDisabled: true,
    };
  }

  preHandle = () => {
    let { filepath } = this.props;
    axios
      .post(api.downloadTemplate, {
        file_name: filepath,
      })
      .then((r) => {
        let fileData;
        if (r.data.data) {
          fileData = r.data.data;
        } else {
          fileData = r.data;
        }
        if (!fileData) {
        } else {
          const fileArray = fileData.split("\n");
          const fileFirstLine = fileArray[0].split(",");
          let datasource = fileFirstLine.map((item, index) => {
            return {
              key: index,
              label: item,
              description: "",
              type: 0,
              is_use: true,
              content: "",
            };
          });
          this.props.setDatasource(datasource);
          this.setState({
            fieldNameArr: fileFirstLine,
          });
        }
      })
      .catch(() => {
        message.error("数据获取失败,服务器异常!");
      });
  };

  showInfo = () => {
    let datasource = this.props.tableInfo.map((item, index) => ({
      ...item,
      key: index,
    }));
    this.props.setDatasource(datasource);
  };

  componentDidMount() {
    let { type } = this.props;

    if (type === 0) {
      // 预处理
      this.preHandle();
    } else {
      // 显示信息
      this.showInfo();
    }
    let isDisabled = this.props.type === 0 ? false : true;

    this.setState({
      isLoading: false,
      isDisabled,
    });
  }

  render() {
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
        dataIndex: "label",
        key: "label",
        width: "10vw",
      },
      {
        title: "字段描述",
        dataIndex: "description",
        key: "description",
        width: "10vw",
        render: (text, record, index) => {
          if (this.state.type === 0) {
            return (
              <Input
                placeholder="请输入字段描述"
                onChange={(e) => {
                  let datasource = this.props.datasource;
                  datasource[parseInt(index)].description = e.target.value;
                  this.props.setDatasource(datasource);
                }}
              />
            );
          } else {
            return (
              <Input
                readOnly={this.state.isDisabled}
                value={record.description}
                onChange={(e) => {
                  let datasource = this.props.datasource;
                  datasource[parseInt(index)].description = e.target.value;
                  this.props.setDatasource(datasource);
                }}
              />
            );
          }
        },
      },
      {
        title: "字段类型",
        dataIndex: "type",
        key: "type",
        render: (text, record, index) => {
          if (this.state.type === 0) {
            return (
              <Select
                defaultValue={0}
                style={{ width: 200 }}
                onChange={(e) => {
                  let datasource = this.props.datasource;
                  datasource[parseInt(index)].type = e;
                  this.props.setDatasource(datasource);
                }}
              >
                <Option value={0}>唯一标识(ID)</Option>
                <Option value={1}>数值型变量</Option>
                <Option value={2}>分类型变量</Option>
              </Select>
            );
          } else {
            return (
              <Select
                defaultValue={record.type}
                disabled={this.state.isDisabled}
                style={{ width: 200 }}
                onChange={(e) => {
                  let datasource = this.props.datasource;
                  datasource[parseInt(index)].type = e;
                  this.props.setDatasource(datasource);
                }}
              >
                <Option value={0}>唯一标识(ID)</Option>
                <Option value={1}>数值型变量</Option>
                <Option value={2}>分类型变量</Option>
              </Select>
            );
          }
        },
        width: "10vw",
      },
      {
        title: "是否使用",
        dataIndex: "is_use",
        key: "is_use",
        render: (text, record, index) => {
          if (this.state.type === 0) {
            return (
              <Select
                defaultValue={true}
                onChange={(e) => {
                  let datasource = this.props.datasource;
                  datasource[parseInt(index)].is_use = e;
                  this.props.setDatasource(datasource);
                }}
              >
                <Option value={true}>是</Option>
                <Option value={false}>否</Option>
              </Select>
            );
          } else {
            return (
              <Select
                defaultValue={record.is_use}
                disabled={this.state.isDisabled}
                onChange={(e) => {
                  let datasource = this.props.datasource;
                  datasource[parseInt(index)].is_use = e;
                  this.props.setDatasource(datasource);
                }}
              >
                <Option value={true}>是</Option>
                <Option value={false}>否</Option>
              </Select>
            );
          }
        },
        width: "10vw",
      },
      {
        title: "标签(分类)Map (哑变量处理)",
        dataIndex: "content",
        key: "content",
        width: "10vw",
      },
    ];
    return (
      <div>
        <Spin size="large" spinning={this.state.isLoading}>
          <Table
            style={{ marginLeft: "3vw", marginRight: "2vw" }}
            dataSource={this.props.datasource}
            columns={COLUMNS}
            bordered
            size="small"
            pagination={false}
          />
        </Spin>
      </div>
    );
  }
}

export default DatasourceRuleTable;
