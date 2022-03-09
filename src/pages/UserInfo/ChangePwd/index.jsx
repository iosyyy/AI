import React, { Component } from "react";
import PubSubJS from "pubsub-js";
import { Button, Form, Image, Input} from "antd";

class Comp extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "57" });
  }

    render(){
        return (
        <div>
            <div className="site-layout-content">
                 <h2 className="colorWhite">修改登陆密码:</h2>
                 <Form
                     labelAlign="right"
                     layout="vertical"
                     style={{width:"30%"}}
                 >
                     <Form.Item
                         name="oldPwd"
                         label="旧密码"
                         rules={[{ required: true}]}
                       >
                         <Input readOnly={true}/>
                     </Form.Item>
                     <Form.Item
                         name="newPwd"
                         label="新密码 "
                         rules={[{ required: true}]}
                       >
                         <Input/>
                     </Form.Item>
                     <Form.Item
                         name="newPwdAgain"
                         label="再次确认新密码"
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
