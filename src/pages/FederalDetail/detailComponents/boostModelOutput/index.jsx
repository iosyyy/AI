import React, { Component } from 'react';
import { Divider, Row, Space, Table, Progress } from 'antd';
import axios from 'axios';
import api from '../../../../config/api';
import PrecisionRecall from './precisionRecall';
import Loss from '../../../../components/Loss';

const { Column } = Table;

class BoostModelOutput extends Component {
  constructor(props) {
    super(props);
    let metricsKeys = Object.keys(props.metrics);

    this.state = {
      metricsKeys,
      maxFeature: 0,
      featureDatasouce: [],
    };
  }

  componentDidMount() {
    const { post_data } = this.props;
    let metricsKeys = Object.keys(this.props.metrics);

    if (post_data.role === 'arbiter') {
      return;
    }
    let metricsForPerformanceScores = this.props.metrics[metricsKeys[0]].filter(
      item => item.match(/^iteration_([0-9]$)/g)
    );

    // getPerformanceScoresDatasource
    let metrics = {};
    for (let key of metricsKeys) {
      metrics[key] = metricsForPerformanceScores;
    }
    let postData = { ...post_data, metrics };
    axios
      .post(api.batch, postData)
      .then(data => {
        let performanceScoresDatasource = [];
        for (let key of metricsForPerformanceScores) {
          for (let metricsKey of metricsKeys) {
            let performanceScoresData = {};
            performanceScoresData.key = key + metricsKey;
            performanceScoresData.dataset = metricsKey;
            performanceScoresData.performanceScores = key;
            let trainData = data.data.data[metricsKey][key].data;
            trainData.forEach(
              item => (performanceScoresData[item[0]] = item[1])
            );

            performanceScoresDatasource.push(performanceScoresData);
          }
        }
        this.setState({ performanceScoresDatasource });
      })
      .catch(e => {
        console.error(e);
      });

    // getFeatureSourceDatasource
    let featureDatasource =
      this.props.model.data.data.data.featureImportances.map((item, index) => ({
        key: index,
        featureName: item.fullname,
        value: item.fid,
      }));
    let maxFeature = -1;
    featureDatasource.forEach(item => {
      if (item.value > maxFeature) maxFeature = item.value;
    });

    this.setState({
      metricsForPerformanceScores,
      trainKey: metricsKeys,
      maxFeature,
      featureDatasource,
    });
  }

  render() {
    const { post_data } = this.props;
    if (post_data.role !== 'arbiter') {
      const {
        maxFeature,
        featureDatasource,
        performanceScoresDatasource,
        metricsKeys,
      } = this.state;
      return (
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', display: 'block' }}>
            Tree
          </h1>

          <Divider />

          <h1 style={{ fontSize: 24, fontWeight: 'bold', display: 'block' }}>
            Performance scores
          </h1>
          <Table
            bordered='true'
            pagination={false}
            size='small'
            dataSource={performanceScoresDatasource}
          >
            <Column
              key='performanceScores'
              dataIndex='performanceScores'
              title=''
              width='15vw'
              render={(text, _record, index) => {
                let l = metricsKeys.length;

                if (index % l === 0) {
                  return {
                    children: text,
                    props: {
                      rowSpan: l,
                    },
                  };
                } else {
                  return {
                    children: text,
                    props: {
                      rowSpan: 0,
                    },
                  };
                }
              }}
            ></Column>
            <Column
              key='dataset'
              dataIndex='dataset'
              title='dataset'
              width='15vw'
            ></Column>
            <Column
              key='accuracy'
              dataIndex='accuracy'
              title='accuracy'
              width='15vw'
            ></Column>
            <Column
              key='precision'
              dataIndex='precision'
              title='precision'
              width='15vw'
            ></Column>
            <Column
              key='recall'
              dataIndex='recall'
              title='recall'
              width='15vw'
            ></Column>
          </Table>

          <Divider />

          <h1 style={{ fontSize: 24, fontWeight: 'bold', display: 'block' }}>
            Feature Importance
          </h1>

          <Table
            bordered='true'
            dataSource={featureDatasource}
            pagination={false}
            size='small'
          >
            <Column
              key='featureName'
              dataIndex='featureName'
              title='FEATURE'
              width='15vw'
            ></Column>
            <Column
              key='value'
              dataIndex='value'
              title=''
              render={(text, record) => {
                let per = (record.value / maxFeature) * 100;
                return (
                  <>
                    <Row>
                      <Progress
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        showInfo={false}
                        percent={per}
                        style={{ width: '95%', marginRight: '2%' }}
                      ></Progress>
                      <span>{record.value}</span>
                    </Row>
                  </>
                );
              }}
            ></Column>
          </Table>

          <Divider />
          <PrecisionRecall
            postData={post_data}
            allMetrics={this.props.metrics}
            metricsKeys={metricsKeys}
          />
        </div>
      );
    } else {
      return (
        <Loss post_data={post_data} metricsKeys={this.state.metricsKeys} />
      );
    }
  }
}

export default BoostModelOutput;
