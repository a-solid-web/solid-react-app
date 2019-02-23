import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import CardColumns from "react-bootstrap/CardColumns";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FriendCard } from "./FriendCard";

export default class VerticallyCenteredModal extends React.Component {
    render (){
        let friendsMarkup = this.props.friends ? this.props.friends.map((friend, index) => {
            return (
                <FriendCard key={index} friend={friend} onClick={this.props.deleteFriend}></FriendCard>
            )
        }) : "";

        let messagesMarkup = this.props.messages ? this.props.messages.map((message, index) => {
            return (
                <Nav.Item key={"#" + index}>
                    <Nav.Link eventKey={"#" + index}>{message[0]}</Nav.Link>
                </Nav.Item>
            )
        }) : "";

        let messageTexts = this.props.messages ? this.props.messages.map((message, index) => {
            return (
                <Tab.Pane eventKey={"#" + index}>
                    {message[1]}
                </Tab.Pane>
            )
        }) : "";

        console.log(messageTexts)
        return (
            <Modal
                {... this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <ModalHeader>
                    <ModalTitle id="contained-modal-title-vcenter">
                        {friendsMarkup ? "Your Friends":"Your Messages"}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <CardColumns>
                        {friendsMarkup}
                    </CardColumns>
                    <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                        <Row>
                            <Col sm={2}>
                                <Nav variant="pills" className="flex-column">
                                    {messagesMarkup}
                                </Nav>
                            </Col>
                            <Col sm={10}>
                                <Tab.Content>
                                    {messageTexts}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.onHide}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }
}