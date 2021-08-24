import React, { Component } from "react";
import Loss from "../../../../components/Loss";
import { Col, message, Row, Table } from "antd";
class lossOutput extends Component {
    constructor(props) {
      super(props);
      let metricsKeys = Object.keys(props.metrics);
      this.state = {
        metricsKeys,
      };
    }
  
    render(){
        const { post_data } = this.props;

        if (this.state.metricsKeys.length === 0) {
            return (
              <Row style={{ marginTop: "2vh", height: "62vh" }} justify={"center"}>
                <Col>
                  <h1>There is no data</h1>
                </Col>
              </Row>
            );
        }
        else{
        return (
            <Loss post_data={post_data} metricsKeys={this.state.metricsKeys} />
          );
        }
    }
}
export default lossOutput;