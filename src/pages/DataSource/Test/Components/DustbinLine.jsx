import React, { Component } from "react";

import { DropTarget } from "react-dnd";
import Box from "./Box";
import { Col, Row } from "antd";
import { v4 as uuidv4 } from "uuid";
const bkColor = "rgb(245,245,245)";
const fontColor = "rgb(38,38,38)";

const style = {
  height: "70vh",
  width: "100%",

  padding: "1rem",
  lineHeight: "normal",
  background: bkColor,
  borderRadius: "4px",
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
class DustbinLine extends Component {
  render() {
    const {
      canDrop,
      changeColor,
      isOver,
      connectDropTarget,
      list,
    } = this.props;

    const notEmptyY = list.length !== 0;
    const notEmptyX = list.length >= 2;

    // 使用 connectDropTarget 包裹住 DOM 节点，使其可以接收对应的 drag source 组件
    // connectDropTarget 包裹住的 DOM 节点才能接收 drag source 组件
    return (
      connectDropTarget &&
      connectDropTarget(
        <div style={{ marginTop: "16px" }}>
          <div>
            {notEmptyY ? (
              <Box
                onClick={() => {
                  changeColor(0, list[0].now);
                }}
                change={list[0].change}
                remove={this.props.remove}
                name={list[0].name}
                now={list[0].now}
                key={0}
                index={0}
              />
            ) : (
              <Row
                style={{
                  background: bkColor,

                  color: fontColor,
                  height: "4vh",
                  marginBottom: "1vh",
                }}
                justify={"center"}
                align={"middle"}
              >
                <Col>Y</Col>
              </Row>
            )}
          </div>
          <div style={{ ...style }}>
            {notEmptyX ? (
              list.map((v, i) => {
                if (i === 0) {
                  return;
                }
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
                style={{ color: fontColor, height: "100%" }}
                justify={"center"}
                align={"middle"}
              >
                <Col>X</Col>
              </Row>
            )}
          </div>
        </div>
      )
    );
  }
}

export default DustbinLine;
