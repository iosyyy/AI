import React, { Component } from 'react';

class FederalTrainChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hello: 'it is me',
    };
  }

  render() {
    return <div>{this.state.hello}</div>;
  }
}

export default FederalTrainChoice;
