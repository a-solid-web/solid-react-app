import React from "react";
// import { AuthButton, LoggedIn, LoggedOut } from "@solid/react";
// import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import VerticallyCenteredModal from "./components/VerticallyCenteredModal";
// import { ProfilePicture } from "./components/ProfilePicture";
// import { AddPicture } from "./components/AddPicture";
// import { ChangeProfilePicture } from "./components/ChangeProfilePicture";
// import FriendsModal from "./components/FriendsModal";
// import Profile from "./components/Profile";
// import PublicProfile from "./components/PublicProfile";
import { BrowserRouter, Route, Switch } from "react-router-dom"; 
import Home from "./components/Home";
import PublicProfile from "./components/PublicProfile"; 
import ErrorPage from "./components/ErrorPage";
import Register from "./components/Register";
import Test from "./components/Test";
import Navigation from "./components/Navigation";


const $rdf = require("rdflib");
const auth = require("solid-auth-client");

const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friendsModal: false,
      inboxModal: false,
      pictureModal: false,
      privacyModal: false,
      webId: "", 
      picture: ""
    };
  }

  /*toggleFriendsModal() {
    this.setState({ friendsModal: !this.state.friendsModal });
  }*/

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation/>
          <Switch>
            <Route path="/" component= {Home} exact/>
            <Route path="/public/card" component={PublicProfile} />
            <Route component={ErrorPage}/>
            <Route path="/register" component={Register} />
            <Route path="/test" component={Test} />
          </Switch>  
        </div>
      </BrowserRouter>

    );
  }
}

export default App;
