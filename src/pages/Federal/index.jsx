import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Form from "./Form";
import Result from "./Result";
import '../../css/fontColor.css'
export default class Normal extends Component {

  render() {
    return (
      <div className="site-layout-content">
      <h1 className={"colorWhite"}>联邦学习</h1>
        <Switch>
          <Route path="/federal/form" component={Form}/>
          <Route path="/federal/result" component={Result}/>
          <Redirect to="/federal/form" />
        </Switch>
      </div>
    );
  }
}
