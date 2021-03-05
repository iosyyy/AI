import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Form from "../Normal/Form";
import Result from "../Normal/Result";
import FederalTrain from "./Form";
import FederalResult from "./Result";

class FederalIndex extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/federalTrain/form" component={FederalTrain}/>
                    <Route path="/federalTrain/result" component={FederalResult}/>
                    <Redirect to="/federalTrain/form"/>
                </Switch>
            </div>
        );
    }
}

export default FederalIndex;
