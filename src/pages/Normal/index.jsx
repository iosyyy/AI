import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Form from "./Form";
import Result from "./Result";
import "../../css/fontColor.css";
import Choice from "./Choice";

export default class Normal extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/normal/form" component={Form} />
          <Route path="/normal/result" component={Result} />
          <Route path="/normal/choice" component={Choice} />
          <Redirect to="/normal/form" />
        </Switch>
      </div>
    );
  }
}
