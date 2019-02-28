import React from "react";
import Button from "react-bootstrap/Button";

export const PrivacyButton = props => {
  return (
    <Button
        id={props.webid}
        type="file"
        onClick={props.onClick}
    >{props.access ? "Restrict Access" : "Give Access"}</Button>
  );
};
