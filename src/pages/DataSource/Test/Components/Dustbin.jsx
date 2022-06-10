import React, { Component } from "react";

import { DropTarget } from "react-dnd";
import Box from "./Box";
import { Col, Row } from "antd";
import { v4 as uuidv4 } from "uuid";

const style = {
  height: "75vh",
  width: "100%",

  padding: "1rem",
  lineHeight: "normal",
  background: "rgb(245,245,245)",
  boxShadow: "0 8px 8px rgba(250,249,248, .24), 0 0 8px rgba(250,249,248, .12)",
};

const boxTarget = {
  // 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
  drop: (props, monitor) => {
    return { name: props.name };
  },
};

@DropTarget(
  // type 标识，这里是字符串 'box'
  "box",
  // 接收拖拽的事件对象
  boxTarget,
  // 收集功能函数，包含 connect 和 monitor 参数
  // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
  (connect, monitor) => ({
    // 包裹住 DOM 节点，使其可以接收对应的拖拽组件
    connectDropTarget: connect.dropTarget(),
    // drag source是否在 drop target 区域
    isOver: monitor.isOver(),
    // 是否可以被放置
    canDrop: monitor.canDrop(),
  })
)
class Dustbin extends Component {
  render() {
    const {
      canDrop,
      changeColor,
      isOver,
      connectDropTarget,
      list,
    } = this.props;
    const notEmpty = list.length !== 0;

    // 使用 connectDropTarget 包裹住 DOM 节点，使其可以接收对应的 drag source 组件
    // connectDropTarget 包裹住的 DOM 节点才能接收 drag source 组件
    return (
      connectDropTarget &&
      connectDropTarget(
        <div
          style={{
            borderRadius: "4px",

            marginTop: "16px",
            overflow: "auto",
            background: "rgb(245,245,245)",
          }}
        >
          <div style={{ ...style }}>
            {notEmpty ? (
              list.map((v, i) => {
                return (
                  <Box
                    onClick={() => {
                      changeColor(i, v.now);
                    }}
                    change={v.change}
                    remove={this.props.remove}
                    name={v.name}
                    now={v.now}
                    key={i}
                    index={i}
                  />
                );
              })
            ) : (
              <Row
                style={{ color: "rgb(38,38,38)", height: "100%" }}
                justify={"center"}
                align={"middle"}
              >
                <Col>{this.props.message ?? "数据为空请重试"}</Col>
              </Row>
            )}
          </div>
        </div>
      )
    );
  }
}

export default Dustbin;
