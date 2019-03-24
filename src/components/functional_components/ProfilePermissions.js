import React from "react";
import Button from "react-bootstrap/Button";


export const PermissionsButton = props => {
    // Function here 


    return (
        <Button
        style = {props.permission ?  {backgroundColor: "red" , marginBottom: "50%", marginTop: "50%"} : { backgroundColor: "green", marginBottom: "50%", marginTop: "50%" }}
        id = {} 
        type = "file"
        onClick={props.onClick}
        > 
        {props.permission ? "Give Access" : "Restrict Access!"}
        </Button>
    )
}
