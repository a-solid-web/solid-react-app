import React from "react";
import { AuthButton } from "@solid/react";

class LoginView extends React.Component {
  render() {
    return (
      <div>
        <h1>Log into your SOLID Pod</h1>
        <AuthButton popup="popup.html" login="Login" logout="Logout" />
      </div>
    );
  }
}

export default LoginView;
