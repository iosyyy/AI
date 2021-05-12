import { Route, Switch, Redirect } from 'react-router-dom';
import Form from './Form';
import React, { Component } from 'react';

import Result from './Result';
import '../../css/fontColor.css';
import FederalChoice from './Choice';
import PubSubJS from 'pubsub-js';

export default class Normal extends Component {
  componentDidMount() {
    PubSubJS.publish('isRunning', { page: '3' });
  }
  render() {
    return (
      <div>
        <Switch>
          <Route path="/federal/form" component={Form} />
          <Route path="/federal/result" component={Result} />
          <Route path="/federal/choice" component={FederalChoice} />
          <Redirect to="/federal/form" />
        </Switch>
      </div>
    );
  }
}
