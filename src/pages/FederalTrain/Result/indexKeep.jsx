import React, { Component } from 'react';
import { Modal, Button, Col, Image, Row, Select, Table } from 'antd';
import FileSaver from 'file-saver';
import fileImg from '../../../img/file.png';
import bigImg from '../../../img/big.png';

class FederalResultKeep extends Component {
  constructor(props) {
    super(props);
    const dataSource1 = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '3',
        name: '胡彦斌',
        age: 34,
        address: '西湖区湖底公园1号',
      },
      {
        key: '4',
        name: '胡彦祖',
        age: 35,
        address: '西湖区湖底公园1号',
      },
    ];
    const dataSource2 = [
      {
        key: '1',
        name: 'ddd',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '3',
        name: 'ccc',
        age: 34,
        address: '西湖区湖底公园1号',
      },
      {
        key: '4',
        name: 'bbb',
        age: 35,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: 'aaa',
        age: 33,
        address: '西湖区湖底公园1号',
      },
    ];
    const columns = [
      {
        title: (
          <div>
            <Image height={15} width={15} src={fileImg} preview={false} />
            姓名
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: (
          <div>
            <Image height={15} width={15} src={fileImg} preview={false} />
            年龄
          </div>
        ),
        dataIndex: 'age',
        key: 'age',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: (
          <div>
            <Image height={15} width={15} src={fileImg} preview={false} />
            地址
          </div>
        ),
        dataIndex: 'address',
        key: 'address',
      },
    ];
    this.state = {
      columns,
      dataSource1,
      dataSource2,
      type: true,
      choice: true,
      isViewing: false,
      isBig: false,
      status: this.props.location.state.status,
    };
  }

  onView = e => {
    this.setState({
      isViewing: true,
    });
  };

  onEnlarge = e => {
    console.log('be large');
  };

  // 点击批量导出数据生成csv文件
  exportList = () => {
    // 拿到所有的数据
    const data = this.state.choice
      ? this.state.dataSource1
      : this.state.dataSource2;
    // 定义数据拼接
    // str:table的每一列的标题，即为导出后的csv文件的每一列的标题
    let str = 'name,age,address';
    for (const i in data) {
      str += '\n';
      str += `${data[i].name},${data[i].age},${data[i].address}`;
    }
    // Excel打开后中文乱码添加如下字符串解决
    const exportContent = '\uFEFF';
    const blob = new Blob([exportContent + str], {
      type: 'text/plain;charset=utf-8',
    });
    // 根据数据生成生成文件
    FileSaver.saveAs(blob, this.state.choice ? 'train.csv' : 'test.csv');
  };

  render() {
    const { dataSource1 } = this.state;
    const { dataSource2 } = this.state;
    const { columns } = this.state;
    const showModal = () => {
      this.setState({
        isBig: true,
      });
    };
    const handleOk = () => {
      this.setState({
        isBig: false,
      });
    };

    const handleCancel = () => {
      this.setState({
        isBig: false,
      });
    };
    return (
      <div
        style={{ height: '80vh' }}
        className="site-card-wrapper site-layout-content"
      >
        <h1 className="colorWhite">联邦训练</h1>

        <Row style={{ marginBottom: '1vh' }}>
          <Col offset={8} span={12}>
            <div>
              <b>数据集选择:</b>
            </div>
          </Col>
        </Row>
        <Row style={{ marginBottom: '4vh' }} justify="center">
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              onChange={e => {
                if (e === 'option1') {
                  this.setState({
                    type: true,
                  });
                } else {
                  this.setState({
                    type: false,
                  });
                }
              }}
              value={this.state.type ? 'option1' : 'option2'}
            >
              <Select.Option value="option1">横向联邦数据集</Select.Option>
              <Select.Option value="option2">纵向联邦数据集</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginBottom: '5vh' }} justify="center">
          <Col span={14}>
            <div style={{ border: '1px solid', height: '38vh' }}>
              <Row gutter={[48, 1]}>
                <Col span={6}>
                  <Col offset={1} span={24}>
                    <div style={{ marginTop: '2vh', marginBottom: '15px' }}>
                      数据浏览器
                    </div>
                  </Col>
                  <Col offset={1} span={24}>
                    <Button
                      onClick={e => {
                        this.setState({
                          choice: true,
                          isViewing: false,
                        });
                      }}
                      type="text"
                    >
                      <Image
                        height={15}
                        width={15}
                        src={fileImg}
                        preview={false}
                      />
                      train.csv
                    </Button>
                  </Col>
                  <Col offset={1} span={24}>
                    <Button
                      onClick={e => {
                        this.setState({
                          choice: false,
                          isViewing: false,
                        });
                      }}
                      type="text"
                    >
                      <Image
                        height={15}
                        width={15}
                        src={fileImg}
                        preview={false}
                      />
                      test.csv
                    </Button>
                  </Col>
                  <Col offset={1} span={24}>
                    <Button
                      onClick={this.exportList}
                      style={{ marginTop: '13vh' }}
                      size="small"
                    >
                      下载
                    </Button>
                  </Col>
                </Col>
                <Col span={18}>
                  <div style={{ marginTop: '2vh', marginBottom: '15px' }}>
                    {this.state.choice ? 'train.csv' : 'test.csv'}
                    {this.state.isViewing ? (
                      <div style={{ float: 'right', marginRight: '4vh' }}>
                        <Button
                          onClick={this.onEnlarge}
                          type="text"
                          size="small"
                        >
                          <Image
                            preview={false}
                            onClick={showModal}
                            src={bigImg}
                            style={{
                              width: 20,
                              height: 20,
                              display: '',
                            }}
                          />
                        </Button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div
                    onClick={this.onView}
                    style={{
                      border: '1px solid',
                      height: '26vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                      marginRight: '4vh',
                      padding: 0,
                    }}
                  >
                    {this.state.isViewing ? (
                      <Table
                        scroll={{ y: '18vh' }}
                        bordered={false}
                        dataSource={
                          this.state.choice ? dataSource1 : dataSource2
                        }
                        columns={columns}
                        pagination={false}
                      />
                    ) : this.state.choice ? (
                      '预览train.csv'
                    ) : (
                      '预览test.csv'
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <Button
              onClick={() => {
                this.props.history.push({
                  pathname: '/federalTrain/choice',
                  state: { type: this.state.type, status: this.state.status },
                });
              }}
              type="primary"
              htmlType="submit"
            >
              下一步
            </Button>
          </Col>
        </Row>
        <Modal
          width="180vh"
          title={this.state.choice ? 'train.csv' : 'test.csv'}
          visible={this.state.isBig}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={
            [] // 设置footer为空，去掉 取消 确定默认按钮
          }
        >
          <Table
            scroll={{ y: '50vh' }}
            dataSource={this.state.choice ? dataSource1 : dataSource2}
            columns={columns}
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}

export default FederalResult;
