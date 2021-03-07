import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Form from "./Form";
import Result from "./Result";
import '../../css/fontColor.css'
import FederalChoice from "./Choice";

export default class Normal extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route path="/federal/form" component={Form}/>
          <Route path="/federal/result" component={Result}/>
            <Route path="/federal/choice" component={FederalChoice}/>
            <Redirect to="/federal/form" />
        </Switch>
      </div>
    );
  }
}
