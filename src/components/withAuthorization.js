import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

const auth = require("solid-auth-client");

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      auth.trackSession(session => {
        if (!condition(session)) {
          console.log("You are not logged in");
          this.props.history.push("/login");
        }
      });
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  return compose(withRouter)(WithAuthorization);
};

export default withAuthorization;
