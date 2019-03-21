import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "../stateful_components/PublicCardButton";


const PublicNameSlot = (props) => {
    return (
            <Row style = {{border: "solid #FFF 5px", width: "100%", marginTop: "10px"}}>
                <Col md="8">
                    <Row style={{width: "100%"}}>
                        {props.publicName}
                    </Row>
                </Col>
                <Col md="4">
                    <Row style={{width: "100%"}}>
                        <PublicCardButton webId={props.webId} publicName={props.publicName}/>
                    </Row>
                </Col>
            </Row>
    )
}

export default PublicNameSlot;