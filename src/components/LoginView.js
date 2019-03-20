import React from "react";
import AuthButton from "@solid/react";

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true
    };
  }

  render() {
    return (
      <div>
        You are logged out
        <AuthButton
          popup="popup.html"
          login="Login here!"
          logout="Logout here!"
        />
      </div>
    );
  }
}

export default LoginView;
