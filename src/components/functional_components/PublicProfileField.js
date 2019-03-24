import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicBioSlot from "./PublicBioSlot"; 
import PublicNameSlot from "./PublicNameSlot";

const PublicProfileField = (props) => {
    const bioMarkup = props.publicBio !== "" ? <PublicBioSlot webId={props.webId} publicBio={props.publicBio}/> : "";

    const nameMarkup = props.publicName !== "" ? <PublicNameSlot webId={props.webId} publicName={props.publicName}/> : "";



    return (
        <Row>
            <Col md="6">
                <Row style={{width: "100%"}}>
                    {bioMarkup}
                    {nameMarkup}
                </Row>
            </Col>
        </Row>
    )
}


export default PublicProfileField; 