import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

const auth = require("solid-auth-client");

const withAuthorization = () => Component => {
  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        webId: null
      };
    }

    componentDidMount() {
      auth.trackSession(session => {
        if (!session) {
          console.log("You are not logged in");
          this.props.history.push("/login");
        } else {
          this.setState({ webId: session.webId });
        }
      });
    }

    render() {
      return <Component webId={this.state.webId} />;
    }
  }
  return compose(withRouter)(WithAuthorization);
};

export default withAuthorization;
