import React, { Component } from "react";
import { Divider, Select, Table, Popconfirm, message, Card } from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import api from "../../../config/api";

class MyDatasourceTable extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>job_id</div>,
        dataIndex: "job_id",
        key: "job_id",
      },
      {
        title: <div>数据表名</div>,
        dataIndex: "tableName",
        key: "tableName",
      },
      {
        title: <div>命名空间</div>,
        dataIndex: "namespace",
        key: "namespace",
      },
      {
        title: <div>工作类型</div>,
        dataIndex: "work_mode",
        key: "work_mode",
        render: (work_mode) => {
          console.log(work_mode);
          return work_mode === 0 ? "单机" : "集群";
        },
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
                  this.props.history.push({
                    pathname: "/datasource/datasourceHandle",
                    state: {
                      data: obj,
                      type: 1,
                    },
                  });
                }}
              >
                查询
              </a>
              <span>/</span>
              <Popconfirm
                title="确定要删除么?"
                onConfirm={() => {
                  let curJobId = obj["job_id"];
                  const formData = new FormData();
                  formData.append("job_id", curJobId);

                  axios
                    .post(api.delDatasource, formData)
                    .then((data) => {
                      const { retcode, retmsg } = data.data.data;
                      if (retcode === 0) {
                        message.success("数据源删除成功!");
                        this.setState({
                          tableIsLoading: true,
                        });
                        axios
                          .get(`${api.datasourceList}?data_type=0`)
                          .then((r) => {
                            if (r.data.data.retcode !== 0) {
                              message.error(r.data.data.retmsg);
                            } else {
                              const { data } = r.data.data;
                              const dataSource = data.map((v, k) => {
                                return {
                                  ...v,
                                  note: v.description,
                                  tableName: v.name,
                                  key: v.job_id,
                                };
                              });

                              this.setState({
                                dataSource,
                                tableIsLoading: false,
                              });
                            }
                          })
                          .catch((e) => {
                            message.error("服务器异常请重试");
                            this.setState({
                              tableIsLoading: false,
                            });
                          });
                      } else {
                        message.error(retmsg);
                        this.setState({
                          tableIsLoading: false,
                        });
                      }
                    })
                    .catch(() => {
                      message.error("数据源删除失败!请检查网络连接");
                    });
                }}
                onCancel={null}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    this.state = this.state = {
      onShowDetail: {},
      detailVisible: false,
      dataSource: [],
      dataSource2: [],
      columns: [],
      file: {},
      curFile: "",
      loading: false,
      COLUMNS: columns,
    };
  }

  setData = (data) => {
    if (data.retcode !== 0) {
      message.error(data.retmsg);
      this.setState({
        loading: false,
      });
    } else {
      const data2 = data.data;
      console.log("data2", data2);
      const dataSource = data2.map((v, k) => {
        return {
          key: k,
          note: v.description,
          tableName: v.name,
          job_id: v.job_id,
          namespace: v.namespace,
          obj: v.custom_table,
          history_table_name: v.history_table_name,
        };
      });

      this.setState({
        dataSource,
        loading: false,
      });
    }
  };

  componentDidMount() {
    this.setState({
      loading: true,
    });
    axios
      .get(`${api.datasourceList}?data_type=1`)
      .then((r) => {
        if (r.data.data) {
          this.setData(r.data.data);
        } else {
          this.setData(r.data);
        }
      })
      .catch((e) => {
        message.error("服务器异常请重试");
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    const {
      dataSource2,
      dataSource,
      detailVisible,
      onShowDetail,
      curFile,
      file,
      loading,
      COLUMNS,
      columns,
    } = this.state;

    return (
      <>
        <Table
          loading={loading}
          bordered
          size="middle"
          Pagination={{ simple: true }}
          dataSource={dataSource}
          columns={COLUMNS}
        />
      </>
    );
  }
}

export default withRouter(MyDatasourceTable);
