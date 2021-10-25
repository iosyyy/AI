import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Form from "../Normal/Form";
import Result from "../Normal/Result";
import Choice from "../Normal/Choice";
import BatchInterface from "./BatchInterface";
import Interface from "./Interface";
import Model from "./Model";
import UploadData from "./UploadData";

class Reasoning extends Component {
  render() {
    return (
      <div className="site-layout-content" style={{ height: "83vh" }}>
        <Switch>
          <Route exact path="/reasoning/model" component={Model} />
          <Route path="/reasoning/interface" component={Interface} />
          <Route path="/reasoning/batch_interface" component={BatchInterface} />
          <Route path="/reasoning/upload_data" component={UploadData} />
          <Redirect to="/reasoning/model" />
        </Switch>
      </div>
    );
  }
}

export default Reasoning;
