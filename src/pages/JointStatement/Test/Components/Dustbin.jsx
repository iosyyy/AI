import React from "react";

import { DropTarget } from "react-dnd";
import Box from "./Box";

const style = {
  height: "75vh",
  width: "100%",

  padding: "1rem",
  lineHeight: "normal",
  background: "rgb(245,245,245)",
  borderRadius: "0.7rem",
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
class Dustbin extends React.Component {
  render() {
    const {
      canDrop,
      changeColor,
      isOver,
      connectDropTarget,
      list,
    } = this.props;
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
        <div>
          <div style={{ ...style }}>
            {list.map((v, i) => {
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
            })}
          </div>
        </div>
      )
    );
  }
}

export default Dustbin;
