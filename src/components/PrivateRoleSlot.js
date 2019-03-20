import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";

const PrivateRoleSlot = (props) => {
    return (
        <Row style = {{border: "solid #FFF 5px", width: "100%", marginTop: "10px"}}>
            <Col md="8">
                <Row style={{ width: "100%"}}>
                    {props.role}
                </Row>
            </Col>
            <Col md="4">
                <Row style={{width:"100%"}}>
                    <PublicCardButton webId={props.webId} role={props.role}/>
                </Row>
            </Col>
        </Row>
    )

}

export default PrivateRoleSlot;

