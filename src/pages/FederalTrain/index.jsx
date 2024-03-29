import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import FederalTrain from "./Form";
import FederalResult from "./Result";
import FederalTrainChoice from "./Choice";
import FederalTrainType from "./Type";
import PubSubJS from "pubsub-js";

class FederalIndex extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "1" });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/federalTrain/form" component={FederalTrain} />
          <Route path="/federalTrain/result" component={FederalResult} />
          <Route path="/federalTrain/choice" component={FederalTrainChoice} />
          <Route path="/federalTrain/type" component={FederalTrainType} />
          <Redirect to="/federalTrain/form" />
        </Switch>
      </div>
    );
  }
}

export default FederalIndex;
