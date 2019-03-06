import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";
import EditButton from "./EditButton";

const TelephoneSlot = (props) => {
    return (
        <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%"}}>
            <Col md="8">
                <Row style={{width: "100%"}}>
                    {props.telephone[0]}
                </Row>
            </Col>
            <Col md="4">
                <Row style={{width: "100%"}}>
                    <EditButton webid={props.webId} context="telephone number" currentvalue={props.telephone}/>
                    <PublicCardButton webId={props.webId} telephone={props.telephone[0]}/>
                </Row>
            </Col>
        </Row>
    )
}

export default TelephoneSlot;