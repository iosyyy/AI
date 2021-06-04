import React, { Component } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
// ...

/**
 * This function is responsible for setting up the diagram's initial properties and any templates.
 */
function initDiagram() {
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

  diagram.nodeTemplate = $(
    go.Node,
    "Auto",
    $(
      go.Shape,
      "RoundedRectangle",
      { strokeWidth: 0 },
      new go.Binding("fill", "color")
    ),
    $(go.TextBlock, { margin: 10 }, new go.Binding("text", "key"))
  );
  diagram.linkTemplate = $(
    go.Link,
    $(go.Shape, { strokeWidth: 2 }),
    // The label
    $(go.Shape, "Circle", {
      segmentIndex: 0,
      width: 15,
      height: 15,
      fill: "rgb(65,66,75)",
      strokeWidth: 2,
    })
  );

  diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" },
      { key: "Gamma", color: "lightgreen" },
      { key: "Delta", color: "rgb(65,66,75)" },
    ],
    [
      { from: "Alpha", to: "Beta" },

      { from: "Beta", to: "Gamma" },
      { from: "Gamma", to: "Delta" },
    ]
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
  // create one Animation for each link, so that they have independent durations
  diagram.links.each(function (node) {
    console.log(node.elt(1));
    console.log(node.elt(0).qg.nb.from);
    let { to } = node.elt(0).qg.nb;
    if (to === "Delta" || to === "Beta") {
      return;
    }
    var animation = new go.Animation();
    animation.add(
      node.elt(1),
      "fill",
      node.elt(0).fill,
      go.Brush.randomColor()
    );
    animation.add(node.elt(1), "fraction", 0, 1);
    animation.duration = 1000;
    animation.reversible = true; // Re-run backwards
    animation.runCount = Infinity; // Animate forever
    animation.start();
  });
  return diagram;
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes) {
  console.log(changes);
}
class MainGraph extends Component {
  render() {
    return (
      <div>
        <ReactDiagram
          initDiagram={initDiagram}
          divClassName="diagram-component"
          nodeDataArray={""}
          linkDataArray={""}
          onModelChange={handleModelChange}
          skipsDiagramUpdate
        />
      </div>
    );
  }
}

export default MainGraph;
