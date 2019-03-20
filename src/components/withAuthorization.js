import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

const auth = require("solid-auth-client");
let webId;

const withAuthorization = () => Component => {
  class WithAuthorization extends React.Component {
    componentWillMount() {
      auth.trackSession(session => {
        if (!session) {
          console.log("You are not logged in");
          this.props.history.push("/login");
        } else {
          webId = session.webId;
        }
      });
    }

    render() {
      return <Component webId={webId} />;
    }
  }
  return compose(withRouter)(WithAuthorization);
};

export default withAuthorization;
