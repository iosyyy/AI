import React, { Component } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import finish from "../../img/finish.png";
import loading from "../../img/loading.png";
import failed from "../../img/failed.png";

class MainGraph extends Component {
  constructor(props) {
    super(props);
    const { component_list } = this.props;

    this.state = {
      diagram: {},
      component_list,
      nodeArray: [],
      linkArray: [],
    };
  }
  handleDiagramEvent = (e) => {
    const name = e.name;
    switch (name) {
      case "ChangedSelection": {
        const sel = e.subject.first();
        if (sel) {
          this.setState({ selectedKey: sel.key });
        } else {
          this.setState({ selectedKey: null });
        }
        break;
      }
      default:
        break;
    }
  };
  componentDidMount() {
    const { component_list } = this.props;
    console.log(component_list);
    if (!component_list) {
      message.error("参数错误");
      return null;
    }

    const nodeColors = component_list.map((v, i) => {
      return `${
        v.status === "success"
          ? "rgb(14,199,165)"
          : v.status === "canceled"
          ? "red"
          : "rgb(187,187,200)"
      }`;
    });
    const nodeArray = component_list.map((v, i) => {
      return {
        index: i,
        status: v.status,
        key: v.component_name,
        color: nodeColors[i],
        img:
          v.status === "success"
            ? finish
            : v.status === "canceled"
            ? failed
            : loading,
      };
    });

    const linkArray = [];

    for (let i = 0; i < component_list.length - 1; i++) {
      linkArray.push({
        from: component_list[i].component_name,
        to: component_list[i + 1].component_name,
        color1: nodeColors[i],
        color2: nodeColors[i + 1],
      });
    }

    this.setState({
      nodeArray,
      linkArray,
    });
  }

  initDiagram = () => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": false, // enable undo & redo
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      }),
      layout: $(
        go.TreeLayout, // specify a Diagram.layout that arranges trees
        { angle: 90, layerSpacing: 35 }
      ),
    });
    const { component_list, change } = this.props;

    diagram.nodeTemplate = $(
      go.Node,
      { selectionAdorned: false },
      "Horizontal",
      $(
        go.Panel,
        "Auto",
        $(
          go.Shape,
          "RoundedRectangle",
          { margin: 0, strokeWidth: 0, width: 121, height: 30 },
          new go.Binding("fill", "color"),
          new go.Binding("fill", "isSelected", function (sel, node) {
            if (sel) {
              change(node.Zj.nb.key);
              if (node.Zj.nb.status === "success") {
                return "rgb(39,153,255)";
              } else if (node.Zj.nb.status === "canceled") {
                return "rgb(39,153,255)";
              } else {
                return "rgb(216,44,128)";
              }
            } else {
              if (node.Zj.nb.status === "success") {
                return "rgb(14,199,165)";
              } else if (node.Zj.nb.status === "canceled") {
                return "red";
              } else {
                return "rgb(187,187,200)";
              }
            }
          }).ofObject("")
        ),
        $(
          go.TextBlock,
          { margin: 10, stroke: "white" },
          new go.Binding("text", "key")
        )
      ),

      $(
        go.Picture,
        { margin: 10, width: 15, height: 15 },
        new go.Binding("source", "img"),
        new go.Binding("angle")
      )
    );
    diagram.linkTemplate = $(
      go.Link,
      $(go.Shape, { strokeWidth: 2 }),
      // The label
      $(
        go.Shape,
        "RoundedRectangle",
        {
          segmentIndex: 0,
          width: 7,
          height: 7,
          fill: "rgb(14,199,165)",
        },
        new go.Binding("fill", "color1")
      ),
      $(
        go.Shape,
        "RoundedRectangle",
        {
          segmentIndex: -1,
          width: 7,
          height: 7,
          fill: "rgb(230,178,88)",
        },
        new go.Binding("fill", "color2")
      )
    );

    // This presumes the object to be animated is a label within a Link
    go.AnimationManager.defineAnimationEffect(
      "fraction",
      function (
        obj,
        startValue,
        endValue,
        easing,
        currentTime,
        duration,
        animation
      ) {
        obj.segmentFraction = easing(
          currentTime,
          startValue,
          endValue - startValue,
          duration
        );
      }
    );

    setTimeout(() => {
      diagram.nodes.each(function (node) {
        const status = node.elt(0).elt(0).Zj.nb.status;
        if (
          status &&
          status !== "success" &&
          status !== "canceled" &&
          status !== "waiting" &&
          status !== "failed"
        ) {
          const animation = new go.Animation();
          animation.add(
            node.elt(0).elt(0),
            "fill",
            node.elt(0).elt(0).fill,
            go.Brush.randomColor()
          );

          animation.add(node.elt(1), "angle", 0, 361);
          animation.duration = 1000;
          animation.reversible = true; // Re-run backwards
          animation.runCount = Infinity; // Animate forever
          animation.start();
        }
      });
    }, 1000);
    return diagram;
  };

  render() {
    const { nodeArray, linkArray } = this.state;
    return (
      <div>
        <ReactDiagram
          initDiagram={this.initDiagram}
          divClassName="diagram-component"
          nodeDataArray={nodeArray}
          linkDataArray={linkArray}
          handleDiagramEvent={this.handleDiagramEvent}
        />
      </div>
    );
  }
}

export default MainGraph;
