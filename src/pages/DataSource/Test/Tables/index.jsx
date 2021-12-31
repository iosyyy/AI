import React, { Component } from "react";
import { Button, Col, message, Radio, Row, Spin, Table, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import axios from "axios";
import api from "../../../../config/api";

class DataSourceTablesw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSources: [],
      loading: false,
      total: 200,
      curOption: 0,
      names: [],
      value: "探索性数据分析",
      firstDatum: [],
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    axios
      .post(api.getPreprocess, {
        file_path: localStorage.getItem("file_name"),
      })
      .then((r) => {
        console.log(r);
        if (r.data.code === 0) {
          const { data } = r.data.data;
          const firstDatum = data.data[0];
          const columns = firstDatum.map((v, i) => {
            return {
              title: <div>{v}</div>,
              dataIndex: v,
              key: v,
            };
          });
          const dataSources = [];
          for (let i = 1; i < data.data.length; i++) {
            const dataw = {};
            for (let j = 0; j < data.data[i].length; j++) {
              dataw[firstDatum[j]] = data.data[i][j];
            }
            dataSources.push(dataw);
          }
          this.setState({
            total: data.all_num,
            columns: columns,
            dataSources,
            firstDatum,
          });
        }
      })
      .catch((r) => {
        message.error("数据获取错误请重试");
      })
      .finally((r) => {
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    const {
      loading,
      dataSources,
      columns,
      total,
      value,
      firstDatum,
    } = this.state;
    return (
      <Spin spinning={loading}>
        <Row justify={"space-between"}>
          <Col>
            <h1 className="colorWhite">
              {localStorage.getItem("resultTitle")}
            </h1>
            <Radio.Group
              onChange={(e) => {
                this.setState({
                  value: e.target.value,
                });
              }}
              value={value}
            >
              <Radio value={"探索性数据分析"}>探索性数据分析</Radio>

              <Radio value={"数据建模"}>数据建模</Radio>
            </Radio.Group>
            <Button
              onClick={() => {
                this.props.history.push("/datasource/detail");
                localStorage.setItem("tablesSelectValue", value);
                localStorage.setItem(
                  "processTableData",
                  JSON.stringify(firstDatum)
                );
              }}
              type={"primary"}
            >
              开始进行参数选择
            </Button>
          </Col>
          <Col>
            <Tooltip title="点击返回上一页" color={"#108ee9"}>
              <Button
                onClick={() => {
                  this.props.history.goBack();
                }}
                type={"text"}
                icon={<CloseCircleFilled />}
              />
            </Tooltip>
          </Col>
        </Row>
        <div
          style={{
            fontSize: "small",
            color: "rgb(127,125,142)",
            marginBottom: "1vh",
          }}
        >
          {`Outputting test ${total} instances (only 100 instances are shown in the table)`}
        </div>
        {dataSources.length !== 0 && !loading ? (
          <Table
            empty={true}
            loading={loading}
            bordered={false}
            size={"middle"}
            dataSource={dataSources}
            columns={columns}
            pagination={false}
          />
        ) : (
          <Row style={{ marginTop: "2vh", height: "62vh" }} justify={"center"}>
            <Col>
              <h1>There is no data</h1>
            </Col>
          </Row>
        )}
      </Spin>
    );
  }
}

export default DataSourceTablesw;
