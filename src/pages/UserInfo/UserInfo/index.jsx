import React, { Component } from "react";
import PubSubJS from "pubsub-js";
import { Button, Form, Image, Input} from "antd";

class Comp extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "58" });
  }

    render(){
        return (
        <div>
            <div className="site-layout-content">
                <h2 className="colorWhite">用户信息:</h2>
                <Form
                    labelAlign="right"
                    layout="vertical"
                    style={{width:"30%"}}
                >
                    <Form.Item
                        name="PartyId"
                        label="PartyId"
                        rules={[{ required: true}]}
                      >
                        <Input readOnly={true}/>
                    </Form.Item>
                    <Form.Item
                        name="account"
                        label="用户名"
                        rules={[{ required: true}]}
                      >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="用户名称"
                        rules={[{ required: true}]}
                      >
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary">提交</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
        )
    }
}

export default Comp
