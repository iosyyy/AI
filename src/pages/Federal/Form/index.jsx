import React, { Component } from "react";
import { Form, Button, Select, InputNumber } from "antd";
import {openListenByFederal} from "../../../util/util";
import PubSubJS from 'pubsub-js'

export default class MyForm extends Component {

  onFinish = (values) => {
    //开始监听服务器
    openListenByFederal(values,(data)=>{
      //将从服务器得到的数据传递到result组件
      PubSubJS.publish('result2',data)
    })
    //跳转到结果页面
    this.props.history.push('/federal/result')
  };
  render() {
    return (
      <div>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 10 }}
          layout="horizontal"
          onFinish={this.onFinish}
        >

          <Form.Item name="model" label="模型类型：">
            <Select placeholder="请选择模型">
              <Select.Option value="cnn">cnn</Select.Option>
              <Select.Option value="mlp">mlp</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="dataset" label="数据集类型：" initialValue="mnist">
          <Select >
          <Select.Option value="mnist">mnist</Select.Option>
              <Select.Option value="cifar">cifar</Select.Option>
              <Select.Option value="fmnist">fmnist</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="optimizer" label="优化器类型：" initialValue="sgd">
            <Select >
              <Select.Option value="sgd">sgd</Select.Option>
              <Select.Option value="adam">adam</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
              name="local_ep"
              label="客户端学习："
              rules={[{ type: "number", min: 1, max: 1000 }]}
              initialValue={10}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="epochs"
            label="训练次数："
            rules={[{ type: "number", min: 1, max: 10 }]}
            initialValue={5}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item name="lr" label="学习率：" initialValue={0.01} >
            <InputNumber min={0} max={1} step={0.01} />
          </Form.Item>

          <Form.Item label="提交">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
