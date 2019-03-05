import React from "react";
import Button from "react-bootstrap/Button";

export const PrivacyButton = props => {
  return (
    <Button
        style={props.permission ?  {backgroundColor: "red" , marginBottom: "50%", marginTop: "50%"} : { backgroundColor: "green", marginBottom: "50%", marginTop: "50%" }}
        id={props.webid}
        type="file"
        onClick={props.onClick}
    >{props.permission ? "Restrict Access" : "Give Access"}</Button>
  );
};
