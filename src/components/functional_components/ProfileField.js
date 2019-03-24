import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EmailSlot from "../stateful_components/EmailSlot";
import NameSlot from "../stateful_components/NameSlot";
import JobSlot from "../stateful_components/JobSlot";
import BioSlot from "../stateful_components/BioSlot";
import TelephoneSlot from "../stateful_components/TelephoneSlot";

const ProfileField = (props) => {
    const nameMarkup = props.name !== "" ? <NameSlot webId={props.webId} name={props.name}/> : ""; 

    const bioMarkup = props.bio !== "" ? <BioSlot webId={props.webId} bio={props.bio}/> : ""; 
    
    const jobMarkup = props.job !== "" ? <JobSlot webId={props.webId} job={props.job}/> : ""; 

    const emailSlots = props.emails.map((email, index) => {
        return (<EmailSlot webId={props.webId} key={index} email={email}/>)
    });

    const telephoneSlots = props.telephones.map((telephone, index) => {
        return (<TelephoneSlot webId={props.webId} key={index} telephone={telephone}/>)
    });

    return (
        <Row style={{marginTop: "20px"}}>
            <Col md="6">
                <Row style={{width: "100%"}}>
                    {nameMarkup}
                    {jobMarkup}
                    {bioMarkup}
                </Row>
            </Col>
            <Col md="6">
                <Row style={{width: "100%"}}>
                    {emailSlots}
                    {telephoneSlots}
                </Row>
            </Col>
        </Row>
    )
}

export default ProfileField;