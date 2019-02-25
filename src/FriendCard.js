import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export const FriendCard = (props) => {
    return (
        <Card style={{ width: "14rem"}}>
            <Card.Body>
                <Card.Img variant="top" style={{borderRadius: 5}} src={props.friend.picture}/>
                <Card.Text>
                    {props.friend.name}
                </Card.Text>
                <Button style={{ backgroundColor: "red"}} onClick={props.onClick} id={props.friend.webId}>Remove Friend</Button>
            </Card.Body>
        </Card>
    )
};