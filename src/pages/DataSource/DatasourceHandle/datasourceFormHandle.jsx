import React, { Component } from "react";
import { Col, Form, Input, Space, Row, Radio, Divider } from "antd";

class DatasourceFormHandle extends Component {
  render() {
    const tailLayout = {
      wrapperCol: { offset: 7 },
    };
    // 表单样式
    const layout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 20 },
    };
    return (
      <>
        <Form layout={"horizontal"} {...layout} size={"middle"}>
          <Row>
            <Col span={8}>
              <Form.Item name="datasource" label="数据源">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tableCode" label="数据代码">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="namespace" label="命名空间">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tableName" label="表名">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="deleteData" label="是否清除残缺数据">
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}

export default DatasourceFormHandle;
