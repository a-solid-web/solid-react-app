import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EmailSlot from "./EmailSlot";
import NameSlot from "./NameSlot";
import JobSlot from "./JobSlot";
import BioSlot from "./BioSlot";
import TelephoneSlot from "./TelephoneSlot";

const ProfileField = (props) => {
    const emailSlots = props.emails.map((email, index) => {
        return (<EmailSlot key={index} email={email}/>)
    });

    const telephoneSlots = props.telephones.map((telephone, index) => {
        return (<TelephoneSlot key={index} telephone={telephone}/>)
    });

    return (
        <Row>
            <Col md="6">
                <Row style={{width: "100%"}}>
                    <NameSlot name={props.name}/>
                    <JobSlot job={props.job}/>
                    <BioSlot bio={props.bio}/>
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