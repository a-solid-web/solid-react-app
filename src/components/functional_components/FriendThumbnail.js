import React from "react";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

const FriendThumbnail = props => {
  const friend = props.friend;
  return (
    <ListGroup.Item onClick={props.onClick} action href={friend.webId.split(".")[0].replace("https://", "#")} style={{width: "100%"}} key={props.index}>
        <Row>
            <Col lg={{ span: 6 }}><p style={{fontSize: "0.75rem"}}>{friend.name}</p></Col>
            <Col lg={{ span: 6 }}>
                <img
                src={friend.picture}
                style={{ maxWidth: "100%" }}
                />
            </Col>
        </Row>
    </ListGroup.Item>
  );
};

export default FriendThumbnail;
