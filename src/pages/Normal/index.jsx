import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Form from "./Form";
import Result from "./Result";

export default class Normal extends Component {

  render() {
    return (
      <div>
      <h1>普通学习</h1>
        <Switch>
          <Route path="/normal/form" component={Form}></Route>
          <Route path="/normal/result" component={Result}></Route>
          <Redirect to="/normal/form" />
        </Switch>
      </div>
    );
  }
}
