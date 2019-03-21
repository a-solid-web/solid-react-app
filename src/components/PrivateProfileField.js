import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PrivateBioSlot from "./PrivateBioSlot"; 
import PrivateNameSlot from "./PrivateNameSlot";
import PrivateRoleSlot from "./PrivateRoleSlot"; 
import PrivateEmailSlot from "./PrivateEmailSlot";


const PrivateProfileField = (props) => {
    const bioMarkup = props.bio !== "" ? <PrivateBioSlot webId={props.webId} bio={props.bio}/> : "";

    const nameMarkup = props.name !== "" ? <PrivateNameSlot webId={props.webId} name={props.name}/> : "";

    const roleMarkup = props.role !== "" ? <PrivateRoleSlot webId = {props.webId}  role={props.role}/> : "";

    const emailMarkup = props.emails.map((email, index) => {
        return (<PrivateEmailSlot webId={props.webId} key={index} email={email}/>)
    });



    return (
        <Row>
            <Col md="6">
                <Row style={{width: "100%"}}>
                    {bioMarkup}
                    {nameMarkup}
                    {roleMarkup}
                </Row>
                <Row style={{width: "100%"}}>
                    {emailMarkup}
                </Row>
            </Col>
        </Row>
    )
}


export default PrivateProfileField; 