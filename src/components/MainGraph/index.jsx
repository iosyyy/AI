import React, { Component } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import finish from "../../img/finish.png";
import loading from "../../img/loading.png";
import failed from "../../img/failed.png";

class MainGraph extends Component {
  constructor(props) {
    super(props);
    const { component_list, component_need_run } = this.props;
    this.state = {
      diagram: {},
      component_list,
      component_need_run,
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
    const { component_list, dependencies, component_need_run } = this.props;
    if (!component_list || !dependencies) {
      message.error("参数错误");
      return null;
    }
    const color = "rgb(187,187,200)";

    const nodeColors = component_list.map((v, i) => {
      return `${
        component_need_run[v.component_name] ? "rgb(14,199,165)" : color
      }`;
    });
    const colorBack = "rgb(248,248,250)";
    const nodeArray = component_list.map((v, i) => {
      return {
        index: i,
        status: v.status,
        is_need_run: v.status,
        key: v.component_name,
        color: nodeColors[i],
        colorA: colorBack,
        colorB: colorBack,
        colorC: colorBack,
        colorD: colorBack,
        colorE: colorBack,
        colorF: colorBack,
        img:
          v.status === "success"
            ? finish
            : v.status === "canceled" || v.status === "failed"
            ? failed
            : loading,
      };
    });
    const linkArray = [];
    const fromPorts = ["A", "B", "C"];
    const toPorts = ["D", "E", "F"];
    for (let dependencie in dependencies) {
      if (dependencies.hasOwnProperty(dependencie)) {
        for (let den of dependencies[dependencie]) {
          const { component_name, up_output_info } = den;
          const isModel = den.type === "model";
          const color = isModel ? "rgb(39,153,255)" : "rgb(127,199,165)";
          let fromPort = fromPorts[up_output_info[1]];
          let toPort = toPorts[up_output_info[1]];
          den.type === "model" ? (fromPort = "B") : "A";
          den.type === "model" ? (toPort = "E") : "F";
          linkArray.push({
            from: component_name,
            to: dependencie,
            color,
            fromPort,
            toPort,
          });
          const node = nodeArray.find((v, i) => {
            return v.key === component_name;
          });
          const index = node.index;
          nodeArray[index][`color${fromPort}`] = color;
          const nodeTo = nodeArray.find((v, i) => {
            return v.key === dependencie;
          });
          const indexTo = nodeTo.index;
          nodeArray[indexTo][`color${toPort}`] = color;
        }
      }
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
        linkFromPortIdProperty: "fromPort", // required information:
        linkToPortIdProperty: "toPort",
      }),
      layout: $(
        go.TreeLayout, // specify a Diagram.layout that arranges trees
        { angle: 90, layerSpacing: 35 }
      ),
    });
    const { component_list, change } = this.props;

    diagram.nodeTemplate = $(
      go.Node,
      {
        selectionAdorned: false,
      },
      "Horizontal",
      $(
        go.Panel,
        "Vertical",
        $(
          go.Panel,
          "Table",
          $(go.RowColumnDefinition, { column: 0, alignment: go.Spot.Left }),
          $(go.RowColumnDefinition, { column: 2, alignment: go.Spot.Right }),
          $(
            go.Panel,
            "Auto",
            { column: 0, row: 0, width: 25, height: 6 },
            new go.Binding("fill", "color"),

            $(go.Shape, "RoundedRectangle", new go.Binding("fill", "colorD"), {
              width: 6,
              height: 6,
              portId: "D",
              stroke: "rgb(248,248,250)",

              toSpot: go.Spot.Left,
            })
          ),
          $(
            go.Panel,
            "Auto",
            { column: 2, row: 0, width: 25 },
            $(go.TextBlock),
            $(
              go.Shape,
              "RoundedRectangle",
              new go.Binding("fill", "colorE"),
              {
                // define a tooltip for each node that displays the color as text
                toolTip: $(
                  "ToolTip",
                  $(
                    go.TextBlock,
                    { margin: 4 },
                    new go.Binding("text", "color")
                  )
                ), // end of Adornment
              },
              {
                width: 6,
                height: 6,
                portId: "E",
                fromSpot: go.Spot.Right,
                stroke: "rgb(248,248,250)",
              }
            )
          ),
          $(
            go.Panel,
            "Auto",
            { column: 1, row: 0, rowSpan: 2, width: 25 },
            $(go.TextBlock),
            $(
              go.Shape,
              "RoundedRectangle",
              new go.Binding("fill", "colorF"),

              {
                width: 6,
                height: 6,
                stroke: "rgb(248,248,250)",
                portId: "F",
                fromSpot: go.Spot.Right,
              }
            )
          )
        ),
        $(
          go.Panel,
          "Auto",
          $(
            go.Shape,
            "RoundedRectangle",
            { margin: 0, width: 150, height: 33 },

            new go.Binding("fill", "color"),
            new go.Binding("fill", "isSelected", function (sel, node) {
              if (sel) {
                change(node.Dj.jb.key);
                if (node.Dj.jb.is_need_run === "success") {
                  return "rgb(39,153,255)";
                } else if (node.Dj.jb.is_need_run === "failed") {
                  return "rgb(216,44,128)";
                } else {
                  return "rgb(216,44,128)";
                }
              } else {
                if (node.Dj.jb.is_need_run === "success") {
                  return "rgb(14,199,165)";
                } else if (node.Dj.jb.is_need_run === "failed") {
                  return "rgb(221,0,27)";
                } else {
                  return "rgb(187,187,200)";
                }
              }
            }).ofObject("")
          ),

          $(
            go.TextBlock,
            {
              column: 0,
              row: 0,
              columnSpan: 3,
              alignment: go.Spot.Center,
              stroke: "white",
            },
            new go.Binding("text", "key")
          )
        ),
        $(
          go.Panel,
          "Table",
          $(go.RowColumnDefinition, { column: 0, alignment: go.Spot.Left }),
          $(go.RowColumnDefinition, { column: 2, alignment: go.Spot.Right }),
          $(
            go.Panel,
            "Auto",
            { column: 0, row: 0, width: 25, height: 6 },
            $(
              go.Shape,
              "RoundedRectangle",
              new go.Binding("fill", "colorA"),

              {
                width: 6,
                stroke: "rgb(248,248,250)",
                height: 6,
                portId: "A",
                toSpot: go.Spot.Left,
              }
            )
          ),
          $(
            go.Panel,
            "Auto",
            { column: 2, row: 0, width: 25 },
            $(go.TextBlock),
            $(
              go.Shape,
              "RoundedRectangle",
              new go.Binding("fill", "colorB"),

              {
                width: 6,
                height: 6,
                portId: "B",
                stroke: "rgb(248,248,250)",
                fromSpot: go.Spot.Right,
              }
            )
          ),
          $(
            go.Panel,
            "Auto",
            { column: 1, row: 0, width: 25 },
            $(go.TextBlock),
            $(
              go.Shape,
              "RoundedRectangle",
              new go.Binding("fill", "colorC"),

              {
                width: 6,
                height: 6,
                portId: "C",
                stroke: "rgb(248,248,250)",
                fromSpot: go.Spot.Right,
              }
            )
          )
        )
      ),
      $(
        go.Picture,
        { margin: 10, width: 15, height: 15 },
        new go.Binding("source", "img"),
        new go.Binding("angle")
      )
    );
    // diagram.linkTemplate = $(
    //   go.Link,
    //   { routing: go.Link.Orthogonal, corner: 3 },
    //   $(go.Shape, { fill: "rgb(127,127,127)" })
    // );
    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.AvoidsNodes, corner: 10 },
      $(
        go.Shape,
        { strokeWidth: 3, stroke: "rgb(14,199,165)" },
        new go.Binding("stroke", "color")
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

  /*  setTimeout(() => {
      diagram.nodes.each(function (node) {
        const status = node.elt(0).bg.jb.status;
        if (
          status &&
          status !== "success" &&
          status !== "canceled" &&
          status !== "waiting" &&
          status !== "failed"
        ) {
          const animation = new go.Animation();
          animation.add(
            node.elt(0),
            "fill",
            node.elt(0).fill,
            go.Brush.randomColor()
          );

          animation.add(node.elt(1), "angle", 0, 361);
          animation.duration = 1000;
          animation.reversible = true; // Re-run backwards
          animation.runCount = Infinity; // Animate forever
          animation.start();
        }
      });
    }, 1000);*/
    return diagram;
  };

  render() {
    const { nodeArray, linkArray } = this.state;
    const { style } = this.props;
    return (
      <div style={{ ...style }}>
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
