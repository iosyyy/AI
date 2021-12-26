import { Component } from "react";
import Box from "./Components";
import Dustbin from "./Components/Dustbin";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

class JointStatement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div style={{ paddingLeft: 200, paddingTop: 50 }}>
          <div style={{ overflow: "hidden", clear: "both" }}>
            <Box
              addItem={(item) => {
                const listCopy = [...this.state.list];
                listCopy.push(item);
                console.log(listCopy);
                this.setState({
                  list: listCopy,
                });
              }}
              name="Glass"
            />
            <Box
              addItem={(item) => {
                const listCopy = [...this.state.list];
                listCopy.push(item);
                console.log(item);
              }}
              name="Banana"
            />
            <Box
              addItem={(item) => {
                const listCopy = [...this.state.list];
                listCopy.push(item);
                console.log(item);
              }}
              name="Paper"
            />
          </div>
          <div style={{ overflow: "hidden", clear: "both" }}>
            <Dustbin />
          </div>
        </div>
      </DndProvider>
    );
  }
}

export default JointStatement;
