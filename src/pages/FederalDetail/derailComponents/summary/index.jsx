import React, { Component } from "react";

class Summary extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.data);
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        {data.map((v, i) => {
          return (
            <div key={v[0] + i} style={{ color: "rgb(127, 125, 142)" }}>
              {v[0] + ": " + v[1]}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Summary;
