import React, { Component } from "react";
import {
  Button,
  Divider,
  Select,
  Space,
  Table,
  Popconfirm,
  Card,
  message,
  Spin,
} from "antd";
import DataSourceUpload from "./dataSourceUpload";
import Modal from "antd/es/modal/Modal";
import DatasourceFormHandle from "../DatasourceHandle/datasourceFormHandle";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../../config/api";
import FileSaver from "file-saver";

const { Option } = Select;

class DataSourceTable extends Component {
  constructor(props) {
    super(props);
    console.log(props);

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
                  this.setState({
                    detailVisible: true,
                    modelIsLoading: true,
                    onShowDetail: obj,
                  });
                  let curJobId = obj["job_id"];
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

                      console.log(jsonData);
                      let file = jsonData.file;
                      axios
                        .post(api.downloadTemplate, {
                          file_name: file,
                        })
                        .then((r) => {
                          console.log(r);
                          const fileData = r.data;
                          if (!fileData) {
                            message.error("空数据异常");
                            this.setState({
                              disabled: true,
                            });
                          } else {
                            const fileArray = fileData.split("\n");
                            const fileFirstLine = fileArray[0].split(",");
                            const column = fileFirstLine.map((v, i) => {
                              return {
                                title: <div>{v}</div>,
                                dataIndex: v,
                                key: v,
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
                              disabled: false,
                            });
                          }
                          this.setState({
                            modelIsLoading: false,
                          });
                        })
                        .catch(() => {
                          message.error("数据获取失败,服务器异常!");
                          setTimeout(() => {
                            this.setState({
                              detailVisible: false,
                              modelIsLoading: false,
                            });
                          }, 1500);
                        });
                    })
                    .catch(() => {
                      message.error("数据获取失败,服务器异常!");
                      setTimeout(() => {
                        this.setState({
                          detailVisible: false,
                          modelIsLoading: false,
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
                  // TODO 删除是有接口额使用接口进行删除而且接口是post方法的
                  let curJobId = obj["job_id"];

                  axios
                    .post(api.queryDatasource, { job_id: curJobId })
                    .then((data) => {
                      if (data.data.retcode === 0) {
                        let curJobId = obj["job_id"];
                        console.log(this.state.dataSource);
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
    };
  }

  componentDidMount() {
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
          });
        }
      })
      .catch((e) => {
        message.error("服务器异常请重试");
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
      file,
    } = this.state;

    return (
      <>
        <Table
          bordered
          size="middle"
          Pagination={{ simple: true }}
          dataSource={dataSource}
          columns={columnsT}
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
                  scroll={{ x: 1500, y: 300 }}
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
