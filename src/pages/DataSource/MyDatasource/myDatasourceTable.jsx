import React, { Component } from "react";
import { Divider, Select, Table, Popconfirm, message, Card } from "antd";
import Mock from "mockjs";
import DatasourceFormHandle from "../DatasourceHandle/datasourceFormHandle";
import Modal from "antd/es/modal/Modal";
import { Option } from "antd/es/mentions";
import axios from "axios";
import api from "../../../config/api";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";

class MyDatasourceTable extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>key</div>,
        dataIndex: "key",
        key: "key",
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
                  this.setState({
                    detailVisible: true,
                    onShowDetail: obj,
                    loading: true,
                  });
                  let curJobId = obj["key"];
                  const formData = new FormData();
                  formData.append("job_id", curJobId);
                  axios
                    .post(api.queryDatasource, formData)
                    .then((data) => {
                      const { retcode, retmsg } = data.data;
                      if (retcode !== 0) {
                        message.error(retmsg);
                      }
                      const jsonData = data.data.data;

                      let file = jsonData.file;
                      axios
                        .post(api.downloadTemplate, {
                          file_name: file,
                        })
                        .then((r) => {
                          let fileData;
                          if (r.data.data) {
                            fileData = r.data.data;
                          } else {
                            fileData = r.data;
                          }
                          console.log(fileData);
                          if (!fileData) {
                            message.error("空数据异常");
                          } else {
                            const fileArray = fileData.split("\n");
                            const fileFirstLine = fileArray[0].split(",");
                            const column = fileFirstLine.map((v, i) => {
                              return {
                                title: <div>{v}</div>,
                                dataIndex: v === "id" ? "key" : v,
                                key: v === "id" ? "key" : v,
                                width: 100,
                              };
                            });
                            const slice = fileArray.slice(1);
                            const dataSource = slice.map((v, i) => {
                              const dataLine = v.split(",");
                              const dataLineObj = {};
                              dataLine.forEach((v, i) => {
                                dataLineObj[
                                  fileFirstLine[i] === "id"
                                    ? "key"
                                    : fileFirstLine[i]
                                ] = v;
                              });
                              return dataLineObj;
                            });
                            const regFile = /[/][\S\s]*[/]/i;
                            const fileName = file.replace(regFile, "");
                            this.setState({
                              curFile: fileName,
                              file: fileData,
                              columns: column,
                              dataSource2: dataSource,
                              loading: false,
                            });
                          }
                        })
                        .catch(() => {
                          message.error("数据获取失败,服务器异常!");
                          setTimeout(() => {
                            this.setState({
                              detailVisible: false,
                              loading: false,
                            });
                          }, 1500);
                        });
                    })
                    .catch(() => {
                      message.error("数据获取失败,服务器异常!");
                      setTimeout(() => {
                        this.setState({
                          detailVisible: false,
                          loading: false,
                        });
                      }, 1500);
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

                  axios
                    .post(api.queryDatasource, { job_id: curJobId })
                    .then((data) => {
                      if (data.data.retcode === 0) {
                        let curJobId = obj["job_id"];
                        let datasource = this.state.dataSource;
                        let d = [
                          ...dataSource.filter(
                            (item) => item["job_id"] !== curJobId
                          ),
                        ];
                        this.setState({ dataSource: d });
                        message.info("数据源删除成功!");
                      } else {
                        message.info("数据源删除失败!");
                      }
                    })
                    .catch(() => {
                      message.error("数据源删除失败!");
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
    console.log(data);
    if (data.retcode !== 0) {
      message.error(data.retmsg);
      this.setState({
        loading: false,
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
        <Modal
          loading={loading}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 80px",
            }}
          >
            <span style={{ color: "rgb(193,193,195)" }}>{curFile}</span>
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
          <Divider orientation="left">
            <h3 style={{ color: "rgb(93,176,215)" }}>数据预处理字段规则定义</h3>
          </Divider>
          <div>
            <Table
              loading={loading}
              scroll={{ x: "95vw" }}
              style={{ marginLeft: "3vw", marginRight: "2vw" }}
              dataSource={dataSource2}
              columns={columns}
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

export default MyDatasourceTable;
