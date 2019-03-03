import React from "react";
import { AuthButton, LoggedIn, LoggedOut } from "@solid/react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VerticallyCenteredModal from "./components/VerticallyCenteredModal";
import { ProfilePicture } from "./components/ProfilePicture";
import { AddPicture } from "./components/AddPicture";
import { ChangeProfilePicture } from "./components/ChangeProfilePicture";
import { PrivacyButton } from "./components/PrivacyButton";
import FriendsModal from "./components/FriendsModal";

const $rdf = require("rdflib");
const auth = require("solid-auth-client");

const FOAF = new $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const LDP = new $rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = new $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const ACT = new $rdf.Namespace("https://www.w3.org/ns/activitystreams#");

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

  toggleModal(e) {
    var modalAction = e.target.id;
    console.log(modalAction)
    switch (modalAction) {
      case "friendsButton": this.setState({friendsModal: !this.state.friendsModal}); break;
      case "messageButton": this.setState({inboxModal: !this.state.inboxModal}); break;
      case "pictureButton": this.setState({pictureModal: !this.state.pictureModal}); break;
      case "privacyButton": this.setState({privacyModal: !this.state.privacyModal}); break;
      default: break;
    }
  }

  fetchPicture = () => {
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    var picture = "";
    fetcher.load(this.state.webId).then(response => {
      picture = store.any($rdf.sym(this.state.webId), VCARD("hasPhoto"));
      if (picture) this.setState({ picture: picture.value });
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

  fetchUser() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        this.setState({ webId: session.webId });
        console.log(this.state.webId);
        this.fetchPicture();
      }
    });
  }

  componentWillMount() {
    this.fetchUser();
  }

  render() {
    return (
      <div>
        <main>
          <Container>
            <Row>
              <Col sm />
              <Col md>
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
                  <Button onClick={this.toggleModal.bind(this)} id="friendsButton">
                    Show My Friends
                  </Button>
                  <Button
                    onClick={this.toggleModal.bind(this)} id="messageButton"
                    style={{ marginLeft: 5 }}
                  >
                    Show My Messages
                  </Button>
                  <VerticallyCenteredModal
                    show={this.state.inboxModal}
                    onHide={this.toggleModal.bind(this)}
                    id="messageButton"
                    webid={(this.state.webId !== "") ? this.state.webId : ""}
                  />
                  <FriendsModal
                    show={this.state.friendsModal}
                    onHide={this.toggleModal.bind(this)}
                    id="friendsButton"
                    webid={this.state.webId}
                  />
                  <FriendsModal
                    friends={this.state.friends}
                    show={this.state.privacyModal}
                    onHide={this.toggleModal.bind(this)}
                    id="privacyButton"
                    webid={this.state.webId}
                  />
                </LoggedIn>
                <PrivacyButton onClick={this.toggleModal.bind(this)}/>
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
              <Col sm />
            </Row>
          </Container>
        </main>
      </div>
    );
  }
}

export default App;