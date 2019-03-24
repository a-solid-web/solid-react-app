import React from "react";
import Image from "react-bootstrap/Image";

const ProfilePicture = (props) => {
  return (
    <Image
      style={{
        border: "solid #999 5px",
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10
      }}
      src={props.picture}
      fluid
    />
  );
};

export default ProfilePicture;