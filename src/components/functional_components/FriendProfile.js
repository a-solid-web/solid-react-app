import React from "react";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const FriendProfile = props => {
    const friend = props.friend;
    return (
    <Tab.Pane eventKey={friend.webId.split(".")[0].replace("https://", "#")} key={props.index}>
    </Tab.Pane>
    )
};

export default FriendProfile;