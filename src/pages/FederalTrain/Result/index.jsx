import React, { Component } from 'react';

class FederalResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hello: 'hello it is an result',
    };
  }

  render() {
    return <div>{this.state.hello}</div>;
  }
}

export default FederalResult;
