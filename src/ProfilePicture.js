import React from "react";
import Image from "react-bootstrap/Image"


export const ProfilePicture = (props) => {
        return (
            <Image src={props.picture} fluid/>
        )
    }

