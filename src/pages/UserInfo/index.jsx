import React, { Component } from "react";
import PubSubJS from "pubsub-js";
import { Redirect, Route, Switch } from "react-router-dom";
import ChangePwd from "./ChangePwd";
import UserInfo from "./UserInfo";

class Comp extends Component {
  constructor(props) {
    super(props);
    PubSubJS.publish("isRunning", { page: "45" });
  }

    render() {
       return (
         <div>
           <Switch>
             <Route
               path="/userinfo/userinfo"
               component={UserInfo}
             />

             <Route
               exact
               path="/userinfo/changepwd"
               component={ChangePwd}
             />

           </Switch>
         </div>
       );
     }
}

export default Comp
