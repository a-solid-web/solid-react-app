import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import { FriendCard } from "./FriendCard";
import AddFriend from "./AddFriend";
import Inbox from "./Inbox";

export default class VerticallyCenteredModal extends React.Component {
  render() {
    let friendsMarkup =
      this.props.id == "friendsButton"
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
    
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader>
          <ModalTitle id="contained-modal-title-vcenter">
            {this.props.id == "friendsButton" || "privacyButton" ? "My Friends" : "My Messages"}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <CardGroup>{friendsMarkup}</CardGroup>
          {this.props.id == "friendsButton" ? <AddFriend /> : null}
          <Row>
            {this.props.id == "messageButton" ? (
              <Inbox webId={this.props.webid} />
            ) : (
              ""
            )}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={this.props.onHide}
            id={
              this.props.id == "messageButton"
                ? "messageButton"
                : "friendsButton"
            }
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
