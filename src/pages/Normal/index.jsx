import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Form from './Form';
import Result from './Result';
import '../../css/fontColor.css';
import Choice from './Choice';
import PubSubJS from 'pubsub-js';

class Normal extends Component {
  componentDidMount() {
    PubSubJS.publish('isRunning', { page: '2' });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/normal/form" component={Form} />
          <Route path="/normal/result" component={Result} />
          <Route path="/normal/choice" component={Choice} />
          <Redirect to="/normal/form" />
        </Switch>
      </div>
    );
  }
}

export default Normal;
