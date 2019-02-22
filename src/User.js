import React from "react";
import withWebId from "@solid/react";

const UserDisplay = withWebId(props =>
    <p>Hey user, your WebID is {props.webID}.</p>);

export UserDisplay;