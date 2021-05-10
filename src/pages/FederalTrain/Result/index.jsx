import React, { Component } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import axios from 'axios';
import api from '../../../config/api';
class FederalResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hello: 'hello it is an result',
    };
  }

  render() {
    const tailLayout = {
      wrapperCol: { offset: 12, span: 8 },
    };
    const layout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 8 },
    };
    return (
      <div
        style={{ height: '80vh' }}
        className="site-card-wrapper site-layout-content"
      >
        <Form
          size={'middle'}
          onFinish={e => {
            const { table_name, namespace } = e;
            axios
              .post(api.taskUpload, {
                file: 'examples/data/breast_homo_guest.csv',
                table_name,
                namespace,
              })
              .then(r => {
                console.log(r);
                if (r.data.retcode === 0) {
                  this.props.history.push({
                    pathname: '/federalTrain/choice',
                    state: { data: r.data.data },
                  });
                } else {
                  message
                    .error(r.data.retcode + ':' + r.data.retmsg)
                    .then(r => {
                      console.log(r);
                    });
                }
              });
          }}
          initialValues={{
            dataset: 'option1',
          }}
          {...layout}
        >
          <Form.Item name="dataset" label="数据集选择">
            <Select>
              <Select.Option value="option1">横向联邦数据集</Select.Option>
              <Select.Option value="option2">纵向联邦数据集</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginTop: '5vh' }}
            name={'table_name'}
            label={'表名'}
          >
            <Input placeholder={'请输入表名'} />
          </Form.Item>
          <Form.Item
            style={{ marginTop: '5vh' }}
            name={'namespace'}
            label={'命名空间'}
          >
            <Input placeholder={'请输入命名空间'} />
          </Form.Item>
          <Form.Item style={{ marginTop: '15vh' }} {...tailLayout}>
            <Button type="primary" htmlType="submit">
              下一步
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FederalResult;
