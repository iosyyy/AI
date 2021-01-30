import React, { Component } from "react";
import { Route } from "react-router-dom";
import Form from "./Form";
import Result from "./Result";

export default class Normal extends Component {
  componentDidMount() {
    this.props.history.push("/normal/form");
  }
  render() {
    return (
      <div>
        <Route to="/normal/form" component={Form}></Route>
        <Route to="/normal/result" component={Result}></Route>
      </div>
    );
  }
}
