import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";
import EditButton from "./EditButton";

const NameSlot = (props) => {
    return (
        <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%"}}>
            <Col md="8">
                <Row style={{width: "100%"}}>
                    {props.name}
                </Row>
            </Col>
            <Col md="4">
                <Row style={{width: "100%"}}>
                    <EditButton webid={props.webId} context="name" currentvalue={props.name}/>
                    <PublicCardButton webId={props.webId} name={props.name}/>
                </Row>
            </Col>
        </Row>
    )
}

export default NameSlot;