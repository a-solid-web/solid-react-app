import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Message = (props) => {
  return (
    <Row>
      <Col lg={{span: 6}}>
        {props.friendMessage ? props.friendMessage : ""}
      </Col>
      <Col lg={{span: 6}}>
        {props.ownMessage ? props.ownMessage : ""}
      </Col>
    </Row>
  );
};

export default Message;