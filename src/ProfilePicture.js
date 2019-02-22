import React from "react";
import Image from "react-bootstrap/Image"

export const ProfilePicture = (props) => {
    var pictureUrl = props.webId.replace("card#me", "aa.jpeg")

    return (
        <Image src={pictureUrl} fluid/>
    )
}