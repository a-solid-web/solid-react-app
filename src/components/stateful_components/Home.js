import React from "react";
import { AuthButton, LoggedIn, LoggedOut } from "@solid/react";
//import Button from "react-bootstrap/Button";
// import { Button } from "yoda-design-system";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
<<<<<<< HEAD:src/components/Home.js
//import VerticallyCenteredModal from "./VerticallyCenteredModal";
import ProfilePicture from "./ProfilePicture";
import { AddPicture } from "./AddPicture";
import { ChangeProfilePicture } from "./ChangeProfilePicture";
// import FriendsModal from "./FriendsModal";
=======
import VerticallyCenteredModal from "../functional_components/VerticallyCenteredModal";
import ProfilePicture from "../functional_components/ProfilePicture";
import { AddPicture } from "../functional_components/AddPicture";
import { ChangeProfilePicture } from "../functional_components/ChangeProfilePicture";
import FriendsModal from "./FriendsModal";
>>>>>>> origin/development:src/components/stateful_components/Home.js
import Profile from "./Profile";
import withAuthorization from "./withAuthorization";
// import PublicProfile from "./components/PublicProfile";

const $rdf = require("rdflib");

const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friendsModal: false,
      inboxModal: false,
      pictureModal: false,
      privacyModal: false,
      webId: null,
      picture: ""
    };
  }

  toggleModal(e) {
    var modalAction = e.target.id;
    console.log(modalAction);
    switch (modalAction) {
      case "friendsButton":
        this.setState({ friendsModal: !this.state.friendsModal });
        break;
      case "messageButton":
        this.setState({ inboxModal: !this.state.inboxModal });
        break;
      case "pictureButton":
        this.setState({ pictureModal: !this.state.pictureModal });
        break;
      case "privacyButton":
        this.setState({ privacyModal: !this.state.privacyModal });
        break;
      default:
        break;
    }
  }

  fetchPicture = () => {
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    var picture = "";
    fetcher.load(this.state.webId).then(response => {
      picture = store.any($rdf.sym(this.state.webId), VCARD("hasPhoto"));
      if (picture) this.setState({ picture: picture.value });
      return;
    });
  };

  setPicture(e) {
    var filePath = e.target.files[0];
    var store = $rdf.graph();
    var fetcher = new $rdf.Fetcher(store);

    let webId = this.state.webId;

    var reader = new FileReader();
    reader.onload = function() {
      var data = this.result;
      var filename = encodeURIComponent(filePath.name);
      var contentType = "image";
      let pictureURl = webId.replace("card#me", filename);
      fetcher.webOperation("PUT", pictureURl, {
        data: data,
        contentType: contentType
      });
    };
    reader.readAsArrayBuffer(filePath);
  }

  setProfilePicture = e => {
    var filePath = e.target.files[0];
    var store = $rdf.graph();
    var fetcher = new $rdf.Fetcher(store);

    let webId = this.state.webId;
    let currentPicture = this.state.picture;

    var reader = new FileReader();
    reader.onload = function() {
      var data = this.result;
      var filename = encodeURIComponent(filePath.name);
      var contentType = "image";
      let pictureURl = webId.replace("card#me", filename);
      fetcher
        .webOperation("PUT", pictureURl, {
          data: data,
          contentType: contentType
        })
        .then(response => {
          if (response.status === 201) {
            const updater = new $rdf.UpdateManager(store);
            let del = currentPicture
              ? $rdf.st(
                  $rdf.sym(webId),
                  VCARD("hasPhoto"),
                  $rdf.sym(currentPicture),
                  $rdf.sym(webId).doc()
                )
              : [];
            let ins = $rdf.st(
              $rdf.sym(webId),
              VCARD("hasPhoto"),
              $rdf.sym(pictureURl),
              $rdf.sym(webId).doc()
            );
            updater.update(del, ins, (uri, ok, message) => {
              if (ok)
                console.log(
                  "Changes have been applied, reload page to see them"
                );
              else alert(message);
            });
          }
        });
    };
    reader.readAsArrayBuffer(filePath);
  };

  // Updates the state when new props get passed
  static getDerivedStateFromProps(props, state) {
    if (props.webId !== null) return { webId: props.webId };
    return null;
  }
  // Calls fetchUser function when the prop gets passed
  componentDidUpdate() {
    if (!this.state.picture && this.state.webId !== null) this.fetchPicture();
  }

  render() {
    return (
      <div>
        <main>
          <Container>
            <Row style={{ marginTop: "100px" }}>
              <Col md="1" />
              <Col md="10">
                <LoggedIn>
                  <Row>
                    <Col md="8">
                      <ProfilePicture picture={this.state.picture} />
                    </Col>
                    <Col md="4">
                      <Row>
                        <AddPicture onChange={this.setPicture.bind(this)} />
                      </Row>
                      <Row>
                        <ChangeProfilePicture
                          onChange={this.setProfilePicture.bind(this)}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Profile webId={this.state.webId} />
                  {/* <Button
                    onClick={this.toggleModal.bind(this)}
                    id="friendsButton"
                  >
                    Show My Friends
                  </Button>
                  <FriendsModal
                    show={this.state.friendsModal}
                    onHide={this.toggleModal.bind(this)}
                    id="friendsButton"
                    webid={this.state.webId}
                  /> */}
                </LoggedIn>
                <LoggedOut>
                  <p>You are logged out.</p>
                </LoggedOut>
                <AuthButton
                  popup="popup.html"
                  login="Login here!"
                  logout="Logout here!"
                />
                {/*<Button onClick={this.toggleModal.bind(this)} id="friendsButton">
                    Show My Permissions
                  </Button>*/}
              </Col>
              <Col md="1" />
            </Row>
          </Container>
        </main>
      </div>
    );
  }
}

export default withAuthorization()(Home);
