import React, { Component } from "react";
import TreeGraph from "../../../../components/TreeGraph";

class BoostModelOutput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trees: props.model.data.data.data.trees,
      index: 0,
      id: 0,
    };
  }

  render() {
    const { trees, index, id } = this.state;
    return (
      <div className={"scrollContent"} style={{ height: "64vh" }}>
        {/* 参数解释: colors[0]代表顶层颜色,colors[1]代表底层颜色,其他参数先写成固定为3个*/}
        <TreeGraph
          colors={["rgb(204,204,204)", "rgb(163,163,163)"]}
          id={id}
          index={index}
          trees={trees}
        />
      </div>
    );
  }
}

export default BoostModelOutput;
