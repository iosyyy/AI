import React, { Component } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { Button, Input, Menu, Table } from 'antd';
import ShowEnergy from '../../../components/ShowEnergy';
import './change.css';

let { TextArea } = Input;

class Defence extends Component {
  state = {
    option: {
      xAxis: {
        type: 'category',
        data: ['c3', 'c5', 'c8', 'c2', 'c1', 'c10', 'c8'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
        },
      ],
    },
    msg:
      '客户端01:\n检测结果:free_rider_detective[1]:not free rider\n-----------------------------',
  };

  render() {
    return (
      <div>
        <h1>Server Defence Detective</h1>
        <ShowEnergy
          id={'aaa'}
          style={{ width: '100vw', height: '30vh' }}
        ></ShowEnergy>
        <h1>Client Defence Detective</h1>
        <TextArea
          disabled
          autoSize={{ minRows: 7, maxRows: 7 }}
          value={this.state.msg}
        ></TextArea>
      </div>
    );
  }
}

class federalModelOutput extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>index</div>,
        dataIndex: 'index',
        key: 'index',
        align: 'center',
      },
      {
        title: <div>variable</div>,
        dataIndex: 'variable',
        key: 'variable',
        align: 'center',
      },
      {
        title: <div>weight</div>,
        dataIndex: 'weight',
        key: 'weight',
        align: 'center',
      },
    ];
    let dataSource = [];
    for (let i = 0; i < 3; i++) {
      dataSource.push({
        index: i,
        variable: 'x' + i,
        weight: 0.0693,
      });
    }
    this.state = {
      columns,
      dataSource,
    };
  }

  render() {
    return (
      <div style={{ marginTop: '3vh', height: '55vh', overflow: 'auto' }}>
        <Table
          scroll={{ y: '55vh' }}
          bordered={true}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={false}
        />
      </div>
    );
  }
}

class federalDetailOutput extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div>index</div>,
        dataIndex: 'index',
        key: 'index',
        align: 'center',
      },
      {
        title: <div>id</div>,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: <div>y</div>,
        dataIndex: 'y',
        key: 'y',
        align: 'center',
      },
      {
        title: <div>x0</div>,
        dataIndex: 'x0',
        key: 'x0',
        align: 'center',
      },
      {
        title: <div>x1</div>,
        dataIndex: 'x1',
        key: 'x1',
        align: 'center',
      },
      {
        title: <div>x2</div>,
        dataIndex: 'x2',
        key: 'x2',
        align: 'center',
      },
      {
        title: <div>x0</div>,
        dataIndex: 'x3',
        key: 'x3',
        align: 'center',
      },
    ];
    let dataSource = [];
    for (let i = 0; i < 200; i++) {
      dataSource.push({
        index: i,
        id: 0,
        y: 0,
        x0: 1.8369,
        x1: 1.8369,
        x2: 1.29,
        x3: 0.322,
      });
    }
    this.state = {
      columns,
      dataSource,
    };
  }

  render() {
    return (
      <div style={{ marginTop: '3vh', height: '55vh', overflow: 'auto' }}>
        <Table
          scroll={{ y: '55vh' }}
          bordered={false}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
}

function federalDetailLog() {
  let logArr = [
    '[INFO][2021-03-07 07:34:18,020][1103:140127953299264] run task',
    '[INFO][2021-03-07 07:34:18,020][1103:140127953299264] read data',
    '[INFO][2021-03-07 07:34:18,020][1103:140127953299264] check ......',
    '[INFO][2021-03-07 07:34:18,020][1103:140127953299264] save data',
    '[INFO][2021-03-07 07:34:18,020][1103:140127953299264] successful',
    '[INFO][2021-03-07 07:34:18,020][1103:140127953299264] finished',
  ];

  return (
    <div
      style={{
        marginTop: '3vh',
        border: '1px solid',
        height: '55vh',
        overflow: 'auto',
      }}
    >
      {logArr.map((value, index) => {
        if (index !== 4) {
          return (
            <div
              style={{
                color: 'rgb(121,121,122)',
                marginLeft: '1vh',
                marginTop: '0.2vh',
              }}
            >
              {value}
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: 'rgb(51,199,111)',
                marginLeft: '1vh',
                marginTop: '0.2vh',
              }}
            >
              {value}
            </div>
          );
        }
      })}
    </div>
  );
}

let myChart3;

class Evaluation extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: <div style={{ background: 'rgb(173,211,244)' }} />,
        dataIndex: 'index',
        key: 'index',
        align: 'center',
      },
      {
        title: <div style={{ background: 'rgb(173,211,244)' }}>dataset</div>,
        dataIndex: 'dataset',
        key: 'dataset',
        align: 'center',
      },
      {
        title: <div style={{ background: 'rgb(173,211,244)' }}>acc</div>,
        dataIndex: 'acc',
        key: 'acc',
        align: 'center',
      },
      {
        title: <div style={{ background: 'rgb(173,211,244)' }}>ks</div>,
        dataIndex: 'ks',
        key: 'ks',
        align: 'center',
      },
      {
        title: <div style={{ background: 'rgb(173,211,244)' }}>precision</div>,
        dataIndex: 'precision',
        key: 'precision',
        align: 'center',
      },
      {
        title: <div style={{ background: 'rgb(173,211,244)' }}>recall</div>,
        dataIndex: 'recall',
        key: 'recall',
        align: 'center',
      },
    ];
    let dataSource = [];
    dataSource.push({
      index: 0,
      dataset: 'train',
      acc: 0.93609,
      precision: 1,
      recall: 0,
      ks: 0.93609,
    });
    this.state = {
      columns,
      dataSource,
      current: '0',
    };
  }

  drew() {
    let options = [];
    let option1 = {
      xAxis: {
        name: 'tpr',
        type: 'value',
        boundaryGap: false,
        show: true,
        min: 0, // 设置y轴刻度的最小值
        max: 1, // 设置y轴刻度的最大值
        splitNumber: 5, // 设置y轴刻度间隔个数
      },
      yAxis: {
        name: 'tpr',
        type: 'value',
        min: 0, // 设置y轴刻度的最小值
        max: 1, // 设置y轴刻度的最大值
        splitNumber: 5, // 设置y轴刻度间隔个数
      },
      series: [
        {
          data: [
            [0, 0.24],
            [0.01, 0.45],
            [0.02, 0.76],
            [0.04, 0.79],
            [0.05, 0.8],
            [0.07, 0.9],
            [0.1, 0.95],
            [0.13, 1],
            [1, 1],
          ],
          type: 'line',
          areaStyle: {},
          smooth: true,
          symbol: 'none', //取消折点圆圈
        },
      ],
    };
    let option2 = {
      xAxis: {
        name: 'tpr',
        type: 'value',
        boundaryGap: false,
        show: true,
        min: 0, // 设置y轴刻度的最小值
        max: 1, // 设置y轴刻度的最大值
        splitNumber: 5, // 设置y轴刻度间隔个数
      },
      yAxis: {
        name: 'tpr',
        type: 'value',
        min: 0, // 设置y轴刻度的最小值
        max: 1, // 设置y轴刻度的最大值
        splitNumber: 5, // 设置y轴刻度间隔个数
      },
      series: [
        {
          data: [
            [0, 0.24],
            [0.01, 0.45],
            [0.02, 0.76],
            [0.04, 0.79],
            [0.05, 0.8],
            [0.07, 0.9],
            [0.1, 0.95],
            [0.13, 1],
            [1, 1],
          ],
          type: 'line',

          symbol: 'none', //取消折点圆圈

          smooth: true,
        },
        {
          data: [
            [0, 0.38],
            [0.2, 0.53],
            [0.4, 0.7],
            [0.6, 0.91],
            [0.62, 0.87],
            [0.64, 0.95],
            [0.66, 0.84],
            [0.68, 0.91],
            [1, 0.62],
          ],
          type: 'line',

          symbol: 'none', //取消折点圆圈

          smooth: true,
        },
      ],
    };
    let option3 = {
      xAxis: {
        name: 'tpr',
        type: 'value',
        boundaryGap: false,
        show: true,
        min: 0, // 设置y轴刻度的最小值
        max: 1, // 设置y轴刻度的最大值
        splitNumber: 5, // 设置y轴刻度间隔个数
      },
      yAxis: {
        name: 'tpr',
        type: 'value',
        min: 0, // 设置y轴刻度的最小值
        max: 1, // 设置y轴刻度的最大值
        splitNumber: 5, // 设置y轴刻度间隔个数
      },
      series: [
        {
          data: [
            [0, 0.38],
            [0.2, 0.53],
            [0.4, 0.7],
            [0.6, 0.91],
            [0.62, 0.87],
            [0.64, 0.95],
            [0.66, 0.84],
            [0.68, 0.91],
            [1, 0.62],
          ],
          type: 'line',

          symbol: 'none', //取消折点圆圈

          smooth: true,
        },
      ],
    };
    options.push(option1);
    options.push(option2);
    options.push(option3);
    myChart3.setOption(
      {
        ...options[parseInt(this.state.current)],
      },
      200
    );
  }

  componentDidUpdate(prevProps, prevState) {
    this.drew();
  }

  componentDidMount() {
    myChart3 = echarts.init(document.getElementById('evaluation'));
    this.drew();
  }

  handleClick = e => {
    console.log(e.key);
    this.setState({ current: e.key });
  };

  render() {
    const current = this.state.current;
    return (
      <div>
        <div style={{ marginTop: '20px', marginLeft: '10px' }}>
          <h2 style={{ marginBottom: '20px' }}>Evaluation scores</h2>
          <div>
            <Table
              bordered={true}
              dataSource={this.state.dataSource}
              columns={this.state.columns}
              pagination={false}
              size="small"
            />
          </div>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[current]}
            mode="horizontal"
          >
            <Menu.Item key="0">ROC</Menu.Item>
            <Menu.Item key="1">K-S</Menu.Item>
            <Menu.Item key="2">Accuracy</Menu.Item>
          </Menu>
          <div style={{ padding: 0, width: '100%' }}>
            <div style={{ width: '100%', height: '38vh' }} id="evaluation" />
          </div>
        </div>
      </div>
    );
  }
}

let echarts = require('echarts');

let myChart1;
let myChart2;

class Compare extends Component {
  drew() {
    let options = {
      title: {
        text: 'acc',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [2, 4, 6, 8, 10, '最终测试'],
      },
      yAxis: {
        type: 'value',
        max: 1, // 设置y轴刻度的最大值
      },
      legend: {
        data: ['联邦攻防', '加入攻击的联邦攻防'],
      },
      series: [
        {
          name: '联邦攻防',
          data: [0.95, 0.955, 0.96, 0.964, 0.966, 0.971],
          type: 'line',
          lineStyle: {
            width: 5,
          },
        },
        {
          name: '加入攻击的联邦攻防',
          data: [0.52, 0.55, 0.6, 0.64, 0.66, 0.98],
          type: 'line',
          lineStyle: {
            width: 5,
          },
        },
      ],
    };
    let optionsFail = {
      title: {
        text: 'fail',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [2, 4, 6, 8, 10, '最终测试'],
      },
      yAxis: {
        type: 'value',
        max: 1, // 设置y轴刻度的最大值
      },
      legend: {
        data: ['联邦攻防', '加入攻击的联邦攻防'],
      },
      series: [
        {
          name: '联邦攻防',
          data: [-0.15, 0.955, 0.96, 0.964, 0.966, 0.971],
          type: 'line',
          lineStyle: {
            width: 5,
          },
        },
        {
          name: '加入攻击的联邦攻防',
          data: [0.52, 0.55, 0.6, 0.64, 0.66, 0.98],
          type: 'line',
          lineStyle: {
            width: 5,
          },
        },
      ],
    };
    myChart1.setOption(
      {
        ...options,
      },
      200
    );
    myChart2.setOption(
      {
        ...optionsFail,
      },
      200
    );
  }

  componentDidMount() {
    myChart1 = echarts.init(document.getElementById('acc'));
    myChart2 = echarts.init(document.getElementById('fail'));

    this.drew();
  }

  render() {
    return (
      <div
        style={{
          border: '1px solid',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{ display: 'inline-block', marginTop: '5px', width: '45%' }}
        >
          <div id="acc" style={{ width: '100%', height: '60vh' }} />
        </div>
        <div
          style={{ display: 'inline-block', marginTop: '5px', width: '45%' }}
        >
          <div id="fail" style={{ width: '100%', height: '60vh' }} />
        </div>
      </div>
    );
  }
}

class FederalDetailShow extends Component {
  constructor(props) {
    super(props);
    let names = [];
    let name = this.props.location.state.name;
    if (name === 'Input') {
      names = ['data output', 'log'];
    } else if (name === 'HeteroLR') {
      names = ['model output', 'data output', 'log'];
    } else if (name === 'Attack Test') {
      names = ['Evaluation', 'compare', 'log'];
    } else if (name === 'Evaluation') {
      names = ['metrics', 'log'];
    } else if (name === 'Defence Test') {
      names = ['Defence', 'compare', 'evalution', 'log'];
    }
    this.state = { change: 0, name, names };
  }

  render() {
    let xr = this.state.names.map((values, index) => {
      return (
        <Button
          onClick={() => {
            this.setState({ change: index });
          }}
          type={index === this.state.change ? 'primary' : 'text'}
        >
          <Link to={'/federalDetail/detail/' + values}>{values}</Link>
        </Button>
      );
    });
    return (
      <div className="site-layout-content">
        <h1>{this.state.name}</h1>
        {xr}
        <Switch>
          <Route
            path="/federalDetail/detail/data output"
            component={federalDetailOutput}
          />
          <Route
            path="/federalDetail/detail/log"
            component={federalDetailLog}
          />
          <Route
            path="/federalDetail/detail/model output"
            component={federalModelOutput}
          />
          <Route
            path="/federalDetail/detail/Evaluation"
            component={Evaluation}
          />
          <Route path="/federalDetail/detail/compare" component={Compare} />
          <Route path="/federalDetail/detail/metrics" component={Evaluation} />
          <Route path="/federalDetail/detail/Defence" component={Defence} />

          <Redirect to={'/federalDetail/detail/' + this.state.names[0]} />
        </Switch>
      </div>
    );
  }
}

export default FederalDetailShow;
