import React, { Component } from "react";
import { Button, Col, Radio, Row, Table, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

class DataSourceTablesw extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>id</div>,
        dataIndex: "id",
        key: "id",
      },
      {
        title: <div>x0</div>,
        dataIndex: "x0",
        key: "x0",
      },
      {
        title: <div>x1</div>,
        dataIndex: "x1",
        key: "x1",
      },
      {
        title: <div>x2</div>,
        dataIndex: "x2",
        key: "x2",
      },
      {
        title: <div>x3</div>,
        dataIndex: "x3",
        key: "x3",
      },
      {
        title: <div>x4</div>,
        dataIndex: "x4",
        key: "x4",
      },
      {
        title: <div>x5</div>,
        dataIndex: "x5",
        key: "x5",
      },
      {
        title: <div>Y</div>,
        dataIndex: "Y",
        key: "Y",
      },
    ];
    const dataSources = [];
    for (let i = 0; i < 100; i++) {
      dataSources[i] = {
        id: i,
        x0: Math.random().toFixed(5),
        x1: Math.random().toFixed(5),
        x2: Math.random().toFixed(5),
        x3: Math.random().toFixed(5),
        x4: Math.random().toFixed(5),
        x5: Math.random().toFixed(5),
        Y: Math.random(),
      };
    }
    this.state = {
      columns,
      dataSources,
      loading: false,
      total: 200,
      curOption: 0,
      names: [],
      value: "探索性数据分析",
    };
  }

  render() {
    const {
      loading,
      dataSources,
      columns,
      total,
      curOption,
      value,
    } = this.state;
    return (
      <div>
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
      </div>
    );
  }
}

export default DataSourceTablesw;
