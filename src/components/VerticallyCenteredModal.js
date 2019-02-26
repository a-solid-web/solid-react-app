import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FriendCard } from "./FriendCard";
import AddFriend from "./AddFriend";

export default class VerticallyCenteredModal extends React.Component {
  render() {
    let friendsMarkup = this.props.friends
      ? this.props.friends.map((friend, index) => {
          return (
            <FriendCard
              key={index}
              friend={friend}
              onClick={this.props.deleteFriend}
            />
          );
        })
      : "";

    let messageTexts = this.props.messages
      ? this.props.messages.map((message, index) => {
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
        })
      : "";

    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader>
          <ModalTitle id="contained-modal-title-vcenter">
            {friendsMarkup ? "My Friends" : "My Messages"}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <CardGroup>{friendsMarkup}</CardGroup>
          {friendsMarkup ? <AddFriend /> : null}
          <Row>{messageTexts}</Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
