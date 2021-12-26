import React from "react";

import { DragSource, DropTarget } from "react-dnd";

const style = {
  height: "12rem",
  width: "12rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  color: "white",
  padding: "1rem",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: "normal",
  float: "left",
};

const boxTarget = {
  // 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
  drop: (props, monitor) => {
    console.log(monitor.getItem());
    return { name: "Dustbin" };
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
class Dustbin extends React.Component {
  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = "#222";
    // 拖拽组件此时正处于 drag target 区域时，当前组件背景色变为 darkgreen
    if (isActive) {
      backgroundColor = "darkgreen";
    }
    // 当前组件可以放置 drag source 时，背景色变为 pink
    else if (canDrop) {
      backgroundColor = "darkkhaki";
    }

    // 使用 connectDropTarget 包裹住 DOM 节点，使其可以接收对应的 drag source 组件
    // connectDropTarget 包裹住的 DOM 节点才能接收 drag source 组件
    return (
      connectDropTarget &&
      connectDropTarget(
        <div style={{ ...style, backgroundColor }}>
          {isActive ? "Release to drop" : "Drag a box here"}
        </div>
      )
    );
  }
}

export default Dustbin;
