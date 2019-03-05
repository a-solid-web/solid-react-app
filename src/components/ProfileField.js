import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EmailSlot from "./EmailSlot";
import NameSlot from "./NameSlot";
import JobSlot from "./JobSlot";
import BioSlot from "./BioSlot";
import TelephoneSlot from "./TelephoneSlot";

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
        <Row>
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