import React, { Component } from "react";
import { Button, Card, Col, Row, Select } from "antd";

class FederalTrain extends Component {
  state = {
    type: true,
  };

  render() {
    return (
      <div>
        <h1 className="colorWhite">联邦学习</h1>
        <div className="site-card-wrapper">
          <Row gutter={[0, 30]}>
            <Col offset={8} span={12}>
              <div>联邦类型:</div>
            </Col>
          </Row>
          <Row gutter={[0, 24]}>
            <Col offset={8} span={8}>
              <Select
                style={{ width: "100%" }}
                onChange={(e) => {
                  if (e === "option1") {
                    this.setState({
                      type: true,
                    });
                  } else {
                    this.setState({
                      type: false,
                    });
                  }
                }}
                value={this.state.type ? "option1" : "option2"}
              >
                <Select.Option value="option1">横向联邦</Select.Option>
                <Select.Option value="option2">纵向联邦</Select.Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={[48, 20]}>
            <Col
              onClick={() => {
                this.setState({
                  type: true,
                });
              }}
              span={6}
              offset={5}
            >
              <Card
                style={{
                  backgroundColor: this.state.type ? "RGB(96,185,234)" : "#FFF",
                }}
                headStyle={{
                  border: 0,
                  textAlign: "center",
                  color: this.state.type ? "white" : "black",
                }}
                title="横向联邦"
                bordered={false}
                hoverable={true}
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
                }}
                headStyle={{
                  border: 0,
                  textAlign: "center",
                  color: !this.state.type ? "white" : "black",
                }}
                title="纵向联邦"
                bordered={false}
                hoverable={true}
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
                    state: { status: this.state.type },
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
