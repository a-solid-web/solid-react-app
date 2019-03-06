import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";
import EditButton from "./EditButton";

const BioSlot = (props) => {
    return (
        <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%"}}>
            <Col md="8">
                <Row style={{width: "100%"}}>
                    {props.bio}
                </Row>
            </Col>
            <Col md="4">
                <Row style={{width: "100%"}}>
                    <EditButton webid={props.webId} context="bio" currentvalue={props.bio}/>
                    <PublicCardButton webId={props.webId} bio={props.bio}/>
                </Row>
            </Col>
        </Row>
    )
}

export default BioSlot;