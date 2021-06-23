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
const { Option } = Select;

const COLUMNS = [
  {
    title: "这个表头",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => {
      return <h1>{index}</h1>;
    },
    width: "5vw",
  },
  {
    title: "等后端",
    dataIndex: "fieldLabel",
    key: "fieldLabel",
    width: "10vw",
  },
  {
    title: "api",
    dataIndex: "fieldName",
    key: "fieldName",
    width: "10vw",
  },
  {
    title: "整完了",
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
    title: "再整",
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
    title: "因为大量数据要写的太多了",
    dataIndex: "map",
    key: "map",
    width: "10vw",
  },
  {
    title: "到时候还要删了重新写",
    dataIndex: "a",
    key: "a",
    width: "10vw",
  },
];

class DataSourceTable extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      onShowDetail: {},
      detailVisible: false,
      modelIsLoading: false,
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
    const { dataSource2, dataSource, detailVisible, onShowDetail } = this.state;

    const columns = [
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
                      //TODO 要把file传到api.downloadTemplate这个接口里面然后下载
                      // 后端传过来的是个字符串然后做字符串split就行了
                      this.setState({
                        modelIsLoading: false,
                      });
                      console.log(data.data);
                      let jsonObj = data.data.file;
                      let jsonStr = JSON.stringify(jsonObj, null, "  ");
                      let file = new Blob([jsonStr], { type: "" });

                      this.setState({ curFile: file });
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
                  <span>文件名...</span>
                  <a>
                    <VerticalAlignBottomOutlined />
                  </a>
                </div>
                <Divider></Divider>
                {/*底下这个scroll要根据数据的多少来决定*/}
                <Table
                  scroll={{ x: 1500, y: 300 }}
                  dataSource={dataSource2}
                  columns={COLUMNS}
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
