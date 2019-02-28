import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const Messages = (props) => {
  let messageTexts = props.messages.map((message, index) => {
    return (
      <Row
        key={"#" + index}
        style={{
          margin: 10,
          padding: 10,
          background: "#eee",
          border: "solid #59f 5px",
          borderRadius: 5
        }}
      >
        <Col md="10">
          {message.actor + " " + message.action + " "}{" "}
          <a href={message.document}>{message.document}</a>{" "}
          {" (" + message.topics + ") with you."}
        </Col>
        <Col md="2">
          <p style={{ color: "grey" }}>
            {message.time[1] + ", " + message.time[0]}
          </p>
        </Col>
      </Row>
    );
  });
  return <div>{messageTexts}</div>
};
