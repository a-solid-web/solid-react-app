import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { PrivacyButton } from "../functional_components/PrivacyButton";

export const FriendSlot = props => {
  return (
    <Row style={{ border: "solid #999 5px", borderRadius: "5", width: "100%", marginLeft: "10%", marginRight: "10%"}}>
      <Col md="3">
        <Image
          fluid
          style={{ borderRadius: 5 }}
          src={props.friend.picture}
        />
      </Col>
      <Col md="3">
        <div>
            {props.friend.name}
        </div>
      </Col>
      <Col md="3">
        <Button
          style={{ backgroundColor: "red" , marginBottom: "50%", marginTop: "50%"}}
          onClick={props.onClick}
          id={props.friend.webId}
        >
          Remove Friend
        </Button>
      </Col>
      <Col md="3">
        <PrivacyButton
          webid={props.friend.webId}
          permission={props.friend.access}
          onClick={props.changeAccess}
        />
      </Col>
    </Row>
  );
};
