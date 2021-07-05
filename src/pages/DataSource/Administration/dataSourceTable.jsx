import React, { Component } from "react";
import { Divider, Table, Popconfirm, Card, message, Spin } from "antd";
import Modal from "antd/es/modal/Modal";
import DatasourceFormHandle from "../DatasourceHandle/datasourceFormHandle";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../../config/api";
import FileSaver from "file-saver";
class DataSourceTable extends Component {
  constructor(props) {
    super(props);

    const columnsT = [
      {
        title: <div>key</div>,
        dataIndex: "key",
        key: "key",
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
        dataIndex: "data_type",
        key: "data_type",
        render: (data_type) => {
          return data_type ? "集群" : "单机";
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
                  axios
                    .post(api.downloadTemplate, { file_name: obj.file })
                    .then((r) => {
                      const { data } = r;
                      const exportContent = "\uFEFF";
                      const blob = new Blob([exportContent + data], {
                        type: "text/plain;charset=utf-8",
                      });
                      const regFile = /[/][\S\s]*[/]/i;
                      const curFile = obj.file.replace(regFile, "");
                      FileSaver.saveAs(blob, curFile);
                    })
                    .catch((r) => {
                      message.error("文件下载失败请重试并检查网络连接");
                    });
                }}
              >
                下载
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
                      const { retcode, retmsg } = data.data;
                      if (retcode === 0) {
                        message.success("数据源删除成功!");
                        this.setState({
                          tableIsLoading: true,
                        });
                        axios
                          .get(`${api.datasourceList}?data_type=0`)
                          .then((r) => {
                            if (r.data.retcode !== 0) {
                              message.error(r.data.retmsg);
                            } else {
                              const { data } = r.data;
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
    this.state = {
      onShowDetail: {},
      detailVisible: false,
      modelIsLoading: false,
      columns: [],
      dataSource: [],
      columnsT,
      disabled: false,
      file: {},
      dataSource2: [],
      tableIsLoading: false,
    };
  }

  setData = (data) => {
    console.log(data);
    if (data.retcode !== 0) {
      message.error(data.retmsg);
      this.setState({
        tableIsLoading: false,
      });
    } else {
      const data2 = data.data;
      const dataSource = data2.map((v, k) => {
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
  };

  componentDidMount() {
    this.setState({
      tableIsLoading: true,
    });
    axios
      .get(`${api.datasourceList}?data_type=0`)
      .then((r) => {
        if (r.data.data.data) {
          this.setData(r.data.data);
        } else {
          this.setData(r.data);
        }
      })
      .catch((e) => {
        message.error("服务器异常请重试");
        this.setState({
          tableIsLoading: false,
        });
      });
  }

  render() {
    const {
      dataSource2,
      dataSource,
      detailVisible,
      onShowDetail,
      columns,
      curFile,
      columnsT,
      tableIsLoading,
      file,
    } = this.state;

    return (
      <>
        <Table
          bordered
          loading={tableIsLoading}
          size="middle"
          Pagination={{ simple: true }}
          dataSource={dataSource}
          columns={columnsT}
        />

        <Modal
          visible={detailVisible}
          title="数据源详情信息"
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
          <Spin size="large" spinning={this.state.modelIsLoading}>
            <Divider orientation="left">
              <h3 style={{ color: "rgb(93,176,215)" }}>基本信息</h3>
            </Divider>
            <DatasourceFormHandle
              isSon={true}
              formData={onShowDetail}
              disabled={true}
              getFormData={(data) => {}}
            />
            <div>
              <Card style={{ padding: "1vh 3vw" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{curFile}</span>
                  <a
                    onClick={() => {
                      const exportContent = "\uFEFF";
                      const blob = new Blob([exportContent + file], {
                        type: "text/plain;charset=utf-8",
                      });
                      FileSaver.saveAs(blob, curFile);
                    }}
                  >
                    <VerticalAlignBottomOutlined />
                  </a>
                </div>
                <Divider />
                {/*底下这个scroll要根据数据的多少来决定*/}
                <Table
                  scroll={{ x: "95vw" }}
                  dataSource={dataSource2}
                  columns={columns}
                  bordered
                  size="small"
                  pagination={false}
                />
              </Card>
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default DataSourceTable;
