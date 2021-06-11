import React, { Component } from "react";
import { Table } from "antd";
import Mock from "mockjs";

class DataSourceTable extends Component {
  constructor(props) {
    super(props);
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
        render: (action) => {
          return (
            <div>
              <a>查看</a>/<a>删除</a>
            </div>
          );
        },
      },
    ];

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
    return (
      <Table
        bordered
        size="middle"
        Pagination={{ simple: true }}
        dataSource={dataSource}
        columns={columns}
      />
    );
  }
}

export default DataSourceTable;
