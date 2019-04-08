import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Message = (props) => {
  return (
    <Row>
      <Col lg={{span: 6}}>
        {props.from === "friend" ? props.message.content : ""}
      </Col>
      <Col lg={{span: 6}}>
        {props.from === "me" ? props.message.content : ""}
      </Col>
    </Row>
  );
};

export default Message;