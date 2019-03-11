import React from "react";

class LoginView extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showLogin: true
        }
    }

    render(){
        return(
            <div>
                You are logged out
            </div>
        )
    }
}

export default LoginView;