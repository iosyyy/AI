import React, { Component } from "react";
import { Modal, Button, Tabs ,Divider} from "antd";
const { TabPane } = Tabs;

export default class tmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logMsg: "",
      isModalVisible: true,
    };
  }
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };
  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({
              isModalVisible: true,
              title: "Evaluation: evaluation_0",
            });
          }}
        >
          111
        </Button>
        <Modal
          title='Basic Modal'
          visible={this.state.isModalVisible}
          onCancel={this.handleCancel}
          footer={null}
          width='80vw'
        >
          <Tabs defaultActiveKey='1'>
            <TabPane tab='metrics' key='1'>
              <h1>Evaluation scores</h1>

                <Divider></Divider>

                <h1>Confusion Matrix</h1>

                <Divider></Divider>
            </TabPane>
            <TabPane tab='log' key='2'>
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}
