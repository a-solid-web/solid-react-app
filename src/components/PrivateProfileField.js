import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PrivateBioSlot from "./PrivateBioSlot"; 
import PrivateNameSlot from "./PrivateNameSlot";
import PrivateRoleSlot from "./PrivateRoleSlot"; 


const PrivateProfileField = (props) => {
    const bioMarkup = props.bio !== "" ? <PrivateBioSlot webId={props.webId} bio={props.bio}/> : "";

    const nameMarkup = props.name !== "" ? <PrivateNameSlot webId={props.webId} name={props.name}/> : "";

    const roleMarkup = props.role !== "" ? <PrivateRoleSlot webId = {props.webId}  role={props.role}/> : "";



    return (
        <Row>
            <Col md="6">
                <Row style={{width: "100%"}}>
                    {bioMarkup}
                    {nameMarkup}
                    {roleMarkup}
                </Row>
            </Col>
        </Row>
    )
}


export default PrivateProfileField; 