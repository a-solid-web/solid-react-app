import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";

const JobSlot = (props) => {
    return (
        <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%"}}>
            <Col md="8">
                <Row style={{width: "100%"}}>
                    {props.job}
                </Row>
            </Col>
            <Col md="4">
                <Row style={{width: "100%"}}>
                    <PublicCardButton webId={props.webId} job={props.job}/>
                </Row>
            </Col>
        </Row>
    )
}

export default JobSlot;