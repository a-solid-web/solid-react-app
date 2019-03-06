import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";
import EditButton from "./EditButton";

const EmailSlot = (props) => {
    return (
        <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%"}}>
            <Col md="8">
                <Row style={{width: "100%"}}>
                    {props.email[0]}
                </Row>
            </Col>
            <Col md="4">
                <Row style={{width: "100%"}}>
                    <EditButton webid={props.webId} context="email address" currentvalue={props.email}/>
                    <PublicCardButton webId={props.webId} email={props.email[0]}/>
                </Row>
            </Col>
        </Row>
    )
}

export default EmailSlot;