import React from "react";

export const AddProfilePicture = (props) => {
    return (
        <div style={{border: "solid #999 5px", borderRadius: 10, marginTop: 5}}>
            <label htmlFor="profilePictureUpload" style={{margin: 5}}>Add a Profile Picture
            <input id="profilePictureUpload" name="profilePictureUpload" type="file" onChange={props.onChange} accept="image/*"/></label>
        </div>
    )
}