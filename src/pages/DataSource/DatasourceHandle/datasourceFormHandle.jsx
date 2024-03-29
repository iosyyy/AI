import React, { Component } from "react";
import { Col, Form, Input, Row, Radio } from "antd";
import { fontStyle } from "../../../util/util";

class DatasourceFormHandle extends Component {
  constructor(props) {
    super(props);
    const { formData, type } = props;
    let isDisabled = type !== 0;
    this.state = {
      formData,
      type,
      canControll: isDisabled,
    };
  }

  componentDidMount() {
    const { formData } = this.state;
    const { setFormData } = this.props;
    setFormData(formData);
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
    const { formData, canControll } = this.state;
    const { setFormData } = this.props;
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
              setFormData(formData);
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
              <Form.Item
                name="originalDatasource"
                label={<div style={fontStyle}>所属数据源</div>}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tableName"
                label={<div style={fontStyle}>数据表名</div>}
                rules={[{ required: true, message: "请输入数据表名" }]}
              >
                <Input readOnly={canControll} placeholder={"请输入数据表名"} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item
                name="description"
                label={<div style={fontStyle}>备注</div>}
              >
                <Input readOnly={canControll} placeholder={"请输入备注"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="work_mode"
                label={<div style={fontStyle}>任务类型</div>}
              >
                <Radio.Group disabled={canControll}>
                  <Radio value={0}>单机</Radio>
                  <Radio value={1}>多机</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/*<div>
            <Row>
              <Col span={8}>
                <Form.Item name='deleteData' label='是否清除残缺数据'>
                  <Radio.Group disabled={disabled}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </div>*/}

          {/* 这块没用上
          <Row>
            <Col span={8}>
              <Form.Item name='deleteData' label='预处理后的数据'>
                <Button type={"link"}>点击下载</Button>
              </Form.Item>
            </Col>
          </Row>
          */}
        </Form>
      </>
    );
  }
}

export default DatasourceFormHandle;
