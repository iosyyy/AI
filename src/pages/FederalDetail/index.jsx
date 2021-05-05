import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import FederalIndex from "../FederalTrain";
import Normal from "../Normal";
import Federal from "../Federal";
import Training from "../Training";
import TrainingRecord from "../TrainingRecord";
import FederalDetailShow from "./detail";
import FederalDetail from "./show";

class FederalDetailAll extends Component {
  render() {
    return (
      <Switch>
        <Route path="/federalDetail/detail" component={FederalDetailShow} />
        <Route path="/federalDetail/show" component={FederalDetail} />

        <Redirect to="/federalDetail/show" />
      </Switch>
    );
  }
}

export default FederalDetailAll;
