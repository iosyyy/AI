import React, { Component } from "react";
import { Button, Card, Col, Row, Select } from "antd";
import "antd/dist/antd.css";
import StepsTemplate from "../../../components/StepsTemplate";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
class FederalTrain extends Component {
  state = {
    type: true,
    selectValue: "homo_lr",
  };

  render() {
    return (
      <div style={{ height: "83vh" }} className="site-layout-content">
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
          <Row style={{ marginBottom: "2vh" }} gutter={[0, 30]}>
            <Col offset={8} span={12}>
              <div>联邦类型:</div>
            </Col>
          </Row>
          <Row style={{ marginBottom: "5vh" }} gutter={[0, 24]}>
            <Col offset={8} span={8}>
              <Select
                style={{ width: "100%" }}
                onChange={(e) => {
                  this.setState({ selectValue: e });
                }}
                value={this.state.selectValue}
              >
                {this.state.type ? (
                  <>
                    <Select.Option value="homo_lr">横向逻辑回归</Select.Option>
                    <Select.Option value="homo_secure_boost">
                      横向安全提升树
                    </Select.Option>
                  </>
                ) : (
                  <>
                    <Select.Option value="hetero_lr">
                      纵向逻辑回归
                    </Select.Option>
                    <Select.Option value="hetero_secure_boost">
                      纵向安全提升树
                    </Select.Option>
                  </>
                )}
              </Select>
            </Col>
          </Row>
          <Row style={{ marginBottom: "15vh" }} gutter={[48, 20]}>
            <Col
              onClick={() => {
                this.setState({
                  selectValue: "homo_lr",

                  type: true,
                });
              }}
              span={6}
              offset={5}
            >
              <Card
                style={{
                  backgroundColor: this.state.type ? "RGB(96,185,234)" : "#FFF",
                  height: "32vh",
                }}
                headStyle={{
                  border: 0,
                  textAlign: "center",
                  color: this.state.type ? "white" : "black",
                }}
                title="横向联邦"
                bordered={false}
                hoverable
              >
                <div
                  style={{
                    height: "150px",
                    color: this.state.type ? "white" : "black",
                  }}
                >
                  适用于参与者的数据特征维度重叠较多的情形
                </div>
              </Card>
            </Col>
            <Col
              onClick={() =>
                this.setState({
                  selectValue: "hetero_lr",

                  type: false,
                })
              }
              span={6}
              offset={2}
            >
              <Card
                style={{
                  backgroundColor: !this.state.type
                    ? "RGB(96,185,234)"
                    : "#FFF",
                  height: "32vh",
                }}
                headStyle={{
                  border: 0,
                  textAlign: "center",
                  color: !this.state.type ? "white" : "black",
                }}
                title="纵向联邦"
                bordered={false}
                hoverable
              >
                <div
                  style={{
                    height: "150px",
                    color: !this.state.type ? "white" : "black",
                  }}
                >
                  适用于参与者数据ID特征重叠较多的情形
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col offset={11} span={12}>
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
              >
                下一步
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default FederalTrain;
