import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Form from "./Form";
import Result from "./Result";

export default class Normal extends Component {

  render() {
    return (
      <div>
      <h1>联邦学习</h1>
        <Switch>
          <Route path="/federal/form" component={Form}></Route>
          <Route path="/federal/result" component={Result}></Route>
          <Redirect to="/federal/form" />
        </Switch>
      </div>
    );
  }
}