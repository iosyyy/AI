import React from "react";
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,} from 'antd';


export default class FederalTrainForm extends React.Component{
    onFinish = (values) => {
        console.log(values);
    };
    render() {
        return (
            <div>
                <Form
                    className="lala"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 6 }}
                    layout="horizontal"
                    onFinish={this.onFinish}
                >
                    <Form.Item name="model" label="模型类型:">
                        <Select placeholder="请选择模型">
                            <Select.Option value="cnn">cnn</Select.Option>
                            <Select.Option value="mlp">mlp</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="socketNum"
                        label="客户端学习次数"
                        rules={[{ type: "number", min: 0}]}
                    >
                        <InputNumber defaultValue={10}/>
                    </Form.Item>

                    <Form.Item name="dataset" label="数据集类型">
                        <Select defaultValue="mnist">
                            <Select.Option value="cifar">cifar</Select.Option>
                            <Select.Option value="mnist">mnist</Select.Option>
                            <Select.Option value="fmnist">fmnist</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="sgd" label="优化器类型">
                        <Select defaultValue="sgd">
                            <Select.Option value="sgd">sgd</Select.Option>
                            <Select.Option value="adam">adam</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="number"
                        label="训练次数"
                        rules={[{ type: "number", min: 1, max: 10 }]}
                    >
                        <InputNumber defaultValue={5}/>
                    </Form.Item>

                    <Form.Item name="student" label="学习率">
                        <InputNumber min={0} max={1} step={0.01} defaultValue={0.01} />
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
