import React, { Component } from "react";
import api from "../../../../config/api";
import TextArea from "antd/es/input/TextArea";

class Log extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 0,
      logDetail: "",
    };
  }

  componentDidMount() {
    const { post_data } = this.props;

    let socket = new WebSocket(
      api.log
        .replace("{id}", post_data.job_id)
        .replace("{role}", post_data.role)
        .replace("{partyId}", post_data.party_id)
        .replace("{name}", post_data.component_name)
    );

    socket.onmessage = (data) => {
      let logDetail = JSON.parse(data.data);

      if (logDetail.type === "logSize") {
        let logSize = logDetail.data.componentInfo;
        if (parseInt(logSize) !== this.state.size) {
          socket.send(
            JSON.stringify({ type: "componentInfo", begin: 1, end: 9999 })
          );
        }
        this.setState({
          size: logSize,
        });
      } else {
        let arr = [];
        if (data) {
          arr = logDetail.data.map(
            (item, index) => `${index}    ${item.content}`
          );
        }
        this.setState({
          logDetail: arr.join("\n\n"),
        });
      }
    };
  }

  componentWillUnmount() {
    //处理逻辑
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div style={{ height: "65vh" }}>
        <TextArea
          className={"scrollContent"}
          style={{
            height: "65vh",
            color: "rgb(181,183,189)",
          }}
          autoSize={{ minRows: 25, maxRows: 25 }}
          onChange={() => {}}
          bordered={false}
          value={this.state.logDetail}
        />
      </div>
    );
  }
}

export default Log;
