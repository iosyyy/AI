import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import PubSubJS from "pubsub-js";
import JointStatementResult from "./Result";
import JointStatementCreate from "./Create";

class JointStatement extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "22" });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            path="/jointStatement/create"
            component={JointStatementCreate}
          />

          <Route
            exact
            path="/jointStatement/result"
            component={JointStatementResult}
          />

          <Redirect to="/jointStatement/create" />
        </Switch>
      </div>
    );
  }
}

export default JointStatement;
