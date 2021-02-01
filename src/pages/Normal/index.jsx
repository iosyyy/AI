import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Form from "./Form";
import Result from "./Result";
import '../../css/fontColor.css'


export default class Normal extends Component {

  render() {
    return (
      <div>
      <h1 className="colorWhite">普通训练</h1>
        <Switch>
          <Route exact path="/normal/form" component={Form}/>
          <Route path="/normal/result" component={Result}/>
          <Redirect to="/normal/form" />
        </Switch>
      </div>
    );
  }
}
