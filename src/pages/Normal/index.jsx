import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Form from "./Form";
import Result from "./Result";
import '../../css/fontColor.css'


export default class Normal extends Component {

    render() {
        return (
            <div className="site-layout-content">
                <h1 className="colorWhite">普通训练</h1>
                <Switch>
                    <Route exact path="/normal/form" component={Form}/>
                    <Route path="/normal/result" component={Result}/>
                    <Redirect to="/normal/form"/>
                </Switch>
            </div>
        );
    }
}
