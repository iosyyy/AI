import React from "react";
import { Motion, spring } from "react-motion/lib/react-motion";
import { range } from "underscore";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = { stiffness: 300, damping: 50 };
const itemsCount = 1;

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
      order: range(itemsCount),
    };
  }

  componentDidMount() {
    window.addEventListener("touchend", this.handleMouseUp);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  handleTouchStart = (key, pressLocation, e) => {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleMouseDown = (pos, pressY, { pageY }) => {
    this.setState({
      topDeltaY: pageY - pressY,
      isPressed: true,
      originalPosOfLastPressed: pos,
    });
  };

  handleMouseMove = ({ pageY }) => {
    const {
      isPressed,
      topDeltaY,
      order,
      originalPosOfLastPressed,
    } = this.state;

    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / 100), 0, itemsCount - 1);
      let newOrder = order;

      if (currentRow !== order.indexOf(originalPosOfLastPressed)) {
        newOrder = reinsert(
          order,
          order.indexOf(originalPosOfLastPressed),
          currentRow
        );
      }

      this.setState({ mouseY: mouseY, order: newOrder });
    }
  };

  handleMouseUp = () => {
    this.setState({ isPressed: false, topDeltaY: 0 });
  };

  render() {
    const { mouseY, isPressed, originalPosOfLastPressed, order } = this.state;

    return (
      <div style={{ width: "100px", height: "100%", display: "inline-block" }}>
        {range(itemsCount).map((i) => {
          const style =
            originalPosOfLastPressed === i && isPressed
              ? {
                  scale: spring(1.1, springConfig),
                  shadow: spring(16, springConfig),
                  y: mouseY,
                }
              : {
                  scale: spring(1, springConfig),
                  shadow: spring(1, springConfig),
                  y: spring(order.indexOf(i) * 100, springConfig),
                };
          return (
            <Motion style={style} key={i}>
              {({ scale, shadow, y }) =>
                this.props.inlineCollapsed ? (
                  <MenuUnfoldOutlined
                    onClick={() => {
                      this.props.setVisFalse();
                    }}
                    onMouseDown={this.handleMouseDown.bind(null, i, y)}
                    onTouchStart={this.handleTouchStart.bind(null, i, y)}
                    className="demo8-item"
                    style={{
                      width: "100%",
                      height: "100px",

                      color: "#fff",
                      boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${
                        2 * shadow
                      }px 0px`,
                      padding: 0,
                      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                      WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                      zIndex: i === originalPosOfLastPressed ? 99 : i,
                    }}
                  />
                ) : (
                  <MenuFoldOutlined
                    onClick={() => {
                      this.props.setVisFalse();
                    }}
                    onMouseDown={this.handleMouseDown.bind(null, i, y)}
                    onTouchStart={this.handleTouchStart.bind(null, i, y)}
                    className="demo8-item"
                    style={{
                      width: "100%",
                      height: "100px",

                      color: "#fff",
                      boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${
                        2 * shadow
                      }px 0px`,
                      padding: 0,
                      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                      WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                      zIndex: i === originalPosOfLastPressed ? 99 : i,
                    }}
                  />
                )
              }
            </Motion>
          );
        })}
      </div>
    );
  }
}
