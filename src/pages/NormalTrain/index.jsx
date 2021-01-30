import React, { Component } from "react";
import NormalTrainForm from "../../components/NormalTrainForm";
import 'echarts/lib/chart/bar';
import echarts from 'echarts/lib/echarts';

export default class NormalTrain extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <NormalTrainForm />
      </div>
    );
  }
}
