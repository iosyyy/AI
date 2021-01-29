import './App.css';
import React from "react";
import {Exhibition} from "./comps/Exhibition";
import {api} from './config/api'

function App() {
  return (
    <div>
      Hello World
        <Exhibition source={api['train']}/>
    </div>
  );
}
export default App;
