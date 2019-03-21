import React from "react";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const MessageInput = props => {
    const friend = props.friend;
    return (
    <Tab.Pane eventKey={friend.webId.split(".")[0].replace("https://", "#")} key={props.index} onLoad={props.onClick}>
        <Row>
            <Col>
            <div style={{padding: "2%", border: "solid #999 5px", borderRadius: 5}}>
                <Row>
                    <Col lg={{span: 11}}>
                        <h6>Send a Message</h6>
                    </Col>
                    <Col lg={{span: 1}} style={{marginBottom: 10}}>
                        <Button size="sm" onClick={props.onClick}>Send</Button>
                    </Col>
                </Row>
                <InputGroup>
                    <FormControl as="textarea" onInput={props.onInput}>
                    </FormControl>
                </InputGroup>
            </div>
            </Col>
        </Row>
    </Tab.Pane>
    )
};

export default MessageInput;