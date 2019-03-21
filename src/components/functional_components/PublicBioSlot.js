import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "../stateful_components/PublicCardButton";

const PublicBioSlot = (props) => {
    return (
        
            <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%", marginTop: "20px", marginBottom: "15px"}}>
                <Col md="8">
                    <Row style={{width: "100%"}}>
                        {props.publicBio}
                    </Row>
                </Col>
                <Col md="4">
                    <Row style={{width: "100%"}}>
                        <PublicCardButton webId={props.webId} publicBio={props.publicBio}/>
                    </Row>
                </Col>
            </Row>
        
    )
}

export default PublicBioSlot; 

