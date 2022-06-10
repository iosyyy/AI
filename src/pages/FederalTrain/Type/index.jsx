import React, { Component } from "react";
import { Button, Card, Col, Row, Select, Form, Space } from "antd";
import "antd/dist/antd.css";
import StepsTemplate from "../../../components/StepsTemplate";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { fontStyle } from "../../../util/util";
const data = [
  {
    value: "homo_lr",
    title: "横向逻辑回归",
  },
  {
    value: "homo_secure_boost",
    title: "横向安全提升树",
  },
  {
    value: "homo_nn",
    title: "横向深度神经网络",
  },
  {
    value: "hetero_lr",
    title: "纵向逻辑回归",
  },
  {
    value: "hetero_secure_boost",
    title: "纵向安全提升树",
  },
  {
    value: "hetero_nn",
    title: "纵向循环神经网络",
  },
];
class FederalTrain extends Component {
  state = {
    type: localStorage.getItem("status"),
    selectValue: localStorage.getItem("value"),
    title:
      localStorage.getItem("status") === "true"
        ? "横向逻辑回归"
        : "纵向逻辑回归",
  };
  toLastPage = () => {
    this.props.history.push({
      pathname: "/federalTrain/form",
    });
  };
  render() {
    return (
      <div className="site-layout-content">
        <StepsTemplate
          steps={[
            { status: "process", title: "联邦类型", icon: <FileOutlined /> },
            {
              status: "wait",
              title: "任务参与方选择",
              icon: <CloudUploadOutlined />,
            },
            {
              status: "wait",
              title: "参数配置",
              icon: <DownloadOutlined />,
            },
          ]}
        />
        <div className="site-card-wrapper">
          <Row style={{ marginTop: "1vh" }} gutter={[0, 15]}>
            <Col style={fontStyle} offset={8} span={12}>
              <div>算法类型:</div>
            </Col>
          </Row>
          <Row style={{ marginBottom: "5vh" }} gutter={[0, 24]}>
            <Col offset={8} span={8}>
              <Select
                style={{ width: "100%" }}
                onChange={(e) => {
                  data.map((val, index) => {
                    if (val.value === e) {
                      this.setState({
                        title: val.title,
                      });
                      return false;
                    }
                  });
                  this.setState({ selectValue: e });
                }}
                value={this.state.selectValue}
              >
                {this.state.type == "true" ? (
                  <>
                    {/*<Select.Option value="homo_line">*/}
                    {/*  横向线性回归*/}
                    {/*</Select.Option>*/}

                    <Select.Option value="homo_lr">横向逻辑回归</Select.Option>
                    <Select.Option value="homo_secure_boost">
                      横向安全提升树
                    </Select.Option>
                    <Select.Option value="homo_dnn">
                      横向深度神经网络
                    </Select.Option>
                  </>
                ) : (
                  <>
                    <Select.Option value="hetero_line">
                      纵向线性回归
                    </Select.Option>
                    <Select.Option value="hetero_lr">
                      纵向逻辑回归
                    </Select.Option>
                    <Select.Option value="hetero_secure_boost">
                      纵向安全提升树
                    </Select.Option>
                    <Select.Option value="hetero_dnn">
                      纵向深度神经网络
                    </Select.Option>
                  </>
                )}
              </Select>
            </Col>
          </Row>

          <Row justify={"center"}>
            <Space size={300}>
              <Button htmlType="button" onClick={this.toLastPage} size="large">
                上一步
              </Button>

              <Button
                onClick={() => {
                  this.props.history.push({
                    pathname: "/federalTrain/result",
                    state: {
                      status: this.state.type,
                      selectValue: this.state.selectValue,
                    },
                  });
                }}
                type="primary"
                htmlType="submit"
                size="large"
              >
                下一步
              </Button>
            </Space>
          </Row>
        </div>
      </div>
    );
  }
}

export default FederalTrain;
