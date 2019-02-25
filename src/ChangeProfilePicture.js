import React from "react";

export const ChangeProfilePicture = (props) => {
    return (
        <div style={{border: "solid #999 5px", borderRadius: 10, marginTop: 5}}>
            <label htmlFor="profilePictureUpload" style={{margin: 5}}>Change your Profile Picture
            <input id="profilePictureUpload" name="profilePictureUpload" type="file" onChange={props.onChange} accept="image/*"/></label>
        </div>
    )
}