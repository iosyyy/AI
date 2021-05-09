import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import FederalTrain from './Form';
import FederalResult from './Result';
import FederalTrainChoice from './Choice';

class FederalIndex extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/federalTrain/form" component={FederalTrain} />
          <Route path="/federalTrain/result" component={FederalResult} />
          <Route path="/federalTrain/choice" component={FederalTrainChoice} />

          <Redirect to="/federalTrain/form" />
        </Switch>
      </div>
    );
  }
}

export default FederalIndex;
