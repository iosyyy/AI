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


export class NormalTrain extends React.Component
{
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }
    onFinish=(values)=>{
        console.log(values)
    }
    render() {
        return (
            <>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onFinish={this.onFinish}
                >
                    <Form.Item name="model" label="模型类型:">
                        <Select>
                            <Select.Option value="cnn">cnn</Select.Option>
                            <Select.Option value="mlp">mlp</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="dataset" label="数据集类型" >
                        <Select>
                            <Select.Option value="cifar">cifar</Select.Option>
                            <Select.Option value="mnist">mnist</Select.Option>
                            <Select.Option value="fmnist">fmnist</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="sgd" label="优化器类型" >
                        <Select>
                            <Select.Option value="sgd">sgd</Select.Option>
                            <Select.Option value="adam">adam</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="number" label="训练次数" rules={[{ type: 'number', min: 1, max: 10 }]}>
                        <InputNumber />
                    </Form.Item>

                    <Form.Item name="student" label="学习率" rules={[{ type: 'number', min: 1, max: 100 }]}>
                        <InputNumber />
                    </Form.Item>

                    <Form.Item  label="提交:">
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </>
        );
    }
}
