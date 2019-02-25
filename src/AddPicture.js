import React from "react"

export const AddPicture = (props) => {
    return (
        <div style={{border: "solid #999 5px", borderRadius: 10}}>
            <label htmlFor="pictureUpload" style={{margin: 5}}>Add a picture to your profile folder
            <input id="pictureUpload" name="pictureUpload" type="file" onChange={props.onChange} accept="image/*"/></label>
        </div>
    )
}