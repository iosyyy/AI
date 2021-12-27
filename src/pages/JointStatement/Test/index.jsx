import { Component } from "react";
import Box from "./Components/Box";
import Dustbin from "./Components/Dustbin";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Col, Row, Space } from "antd";
import {
  NodeCollapseOutlined,
  NodeExpandOutlined,
  DeleteFilled,
  BulbTwoTone,
} from "@ant-design/icons";

class JointStatement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list1: [
        { name: "item1", now: "list1", change: false },
        { name: "item2", now: "list1", change: false },
        { name: "item3", now: "list1", change: false },
      ],
      list2: [],
    };
  }

  changeColor = (index, now) => {
    const listCopy = [...this.state[now]];
    listCopy[index].change = !listCopy[index].change;
    if (now === "list1") {
      this.setState({
        list1: listCopy,
      });
    } else {
      this.setState({
        list2: listCopy,
      });
    }
  };

  remove = (index, now, item, name) => {
    if (now === name) {
      return;
    }
    let listCopy = [...this.state[now]];
    listCopy.splice(index, 1);
    item.change = false;
    if (now === "list1") {
      const listX = [...this.state.list2];
      item.now = "list2";

      listX.push(item);

      this.setState({
        list1: listCopy,
        list2: listX,
      });
    } else {
      const listX = [...this.state.list1];
      item.now = "list1";

      listX.push(item);
      this.setState({
        list2: listCopy,
        list1: listX,
      });
    }
  };

  render() {
    const { list1, list2 } = this.state;
    return (
      <div style={{ padding: "10px 24px" }} className="site-layout-content">
        <DndProvider backend={HTML5Backend}>
          <Row style={{ marginBottom: "4px" }}>
            <Col span={11} />
            <Col span={2} />
            <Col span={11}>
              <Space>
                <Button style={{ borderRadius: 5 }} type={"primary"}>
                  开始分析
                </Button>
                <Button type={"text"} icon={<DeleteFilled />} />
                <Button type={"text"} icon={<BulbTwoTone />} />
              </Space>
            </Col>
          </Row>
          <Row justify={"space-around"}>
            <Col span={11}>
              <Dustbin
                changeColor={this.changeColor}
                name={"list1"}
                remove={this.remove}
                list={list1}
              />
            </Col>
            <Col span={2}>
              <Row
                style={{ height: "75vh" }}
                align={"middle"}
                justify={"center"}
              >
                <Col>
                  <Space direction={"vertical"}>
                    <Button
                      onClick={() => {
                        const list1Copy = [...list1];
                        const list2Copy = [...list2];
                        for (let i = 0; i < list1Copy.length; i++) {
                          if (list1Copy[i].change) {
                            list1Copy[i].change = false;
                            list1Copy[i].now = "list2";

                            list2Copy.push(list1Copy[i]);

                            list1Copy.splice(i, 1);
                            i--;
                          }
                        }
                        console.log(list1Copy);
                        console.log(list2Copy);
                        this.setState({
                          list1: list1Copy,
                          list2: list2Copy,
                        });
                      }}
                      icon={<NodeExpandOutlined />}
                    />
                    <Button
                      onClick={() => {
                        const list1Copy = [...list1];
                        const list2Copy = [...list2];
                        for (let i = 0; i < list2Copy.length; i++) {
                          if (list2Copy[i].change) {
                            list2Copy[i].change = false;
                            list2Copy[i].now = "list1";

                            list1Copy.push(list2Copy[i]);
                            list2Copy.splice(i, 1);
                            i--;
                          }
                        }
                        this.setState({
                          list1: list1Copy,
                          list2: list2Copy,
                        });
                      }}
                      icon={<NodeCollapseOutlined />}
                    />
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col span={11}>
              <Dustbin
                changeColor={this.changeColor}
                name={"list2"}
                remove={this.remove}
                list={list2}
              />
            </Col>
          </Row>
        </DndProvider>
      </div>
    );
  }
}

export default JointStatement;
