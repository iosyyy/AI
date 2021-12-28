import React from "react";
import { DragSource } from "react-dnd";

const style = {
  padding: "0.5rem 1rem",
  borderRadius: "0.2rem",
  cursor: "move",
  marginBottom: 5,
};

const boxSource = {
  /**
   * 开始拖拽时触发当前函数
   * @param {*} props 组件的 props
   */
  beginDrag(props) {
    // 返回的对象可以在 monitor.getItem() 中获取到
    return {
      name: props.name,
      index: props.index,
      now: props.now,
      remove: props.remove,
      change: props.change,
    };
  },

  /**
   * 拖拽结束时触发当前函数
   * @param {*} props 当前组件的 props
   * @param {*} monitor DragSourceMonitor 对象
   */
  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) item.remove(item.index, item.now, item, dropResult.name);
  },
};

@DragSource(
  // type 标识，这里是字符串 'box'
  "box",
  // 拖拽事件对象
  boxSource,
  // 收集功能函数，包含 connect 和 monitor 参数
  // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
  (connect, monitor) => ({
    // 包裹住 DOM 节点，使其可以进行拖拽操作
    connectDragSource: connect.dragSource(),
    // 是否处于拖拽状态
    isDragging: monitor.isDragging(),
  })
)
class Box extends React.Component {
  render() {
    const { isDragging, connectDragSource, onClick } = this.props;
    const { name, change } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    const styleChange = change
      ? {
          background: "rgb(53,158,255)",
          color: "#fff",
        }
      : {
          background: "rgb(245,245,245)",
          color: "black",
        };
    // 使用 connectDragSource 包裹住 DOM 节点，使其可以接受各种拖动 API
    // connectDragSource 包裹住的 DOM 节点才可以被拖动
    return (
      connectDragSource &&
      connectDragSource(
        <div
          onClick={onClick}
          style={{
            ...styleChange,
            ...style,
            opacity,
          }}
        >
          {name}
        </div>
      )
    );
  }
}

export default Box;
