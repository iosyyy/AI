import React, { Component } from "react";
import { Col, Form, Input, Space, Row, Radio, Divider } from "antd";

class DatasourceFormHandle extends Component {
  constructor(props) {
    super(props);
    const { formData } = props;
    this.state = {
      formData,
    };
  }

  componentDidMount() {
    const { formData } = this.state;
    const { getFormData } = this.props;
    getFormData(formData);
  }

  render() {
    const tailLayout = {
      wrapperCol: { offset: 7 },
    };
    // 表单样式
    const layout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 20 },
    };
    const { formData } = this.state;
    const { getFormData, disabled } = this.props;
    return (
      <>
        <Form
          initialValues={formData}
          onValuesChange={(e) => {
            for (let key in e) {
              const { formData } = this.state;
              if (e.hasOwnProperty(key)) {
                formData[key] = e[key];
              }
              getFormData(formData);
              this.setState({
                formData,
              });
            }
          }}
          style={{ marginBottom: "3vh" }}
          layout={"horizontal"}
          {...layout}
          size={"middle"}
        >
          <Row>
            <Col span={8}>
              <Form.Item name="datasource" label="数据源">
                <Input disabled={disabled} placeholder={"请输入数据源"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tableCode" label="数据代码">
                <Input disabled={disabled} placeholder={"请输入数据代码"} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="namespace" label="命名空间">
                <Input disabled={disabled} placeholder={"请输入命名空间"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tableName" label="表名">
                <Input disabled={disabled} placeholder={"请输入表名"} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="deleteData" label="是否清除残缺数据">
                <Radio.Group disabled={disabled}>
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
