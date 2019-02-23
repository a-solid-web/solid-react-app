import React from 'react';
import {
  AuthButton, LoggedIn, LoggedOut,
  Value, Image
} from '@solid/react';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VerticallyCenteredModal from './VerticallyCenteredModal';
import AddFriend from "./AddFriend";
import {ProfilePicture} from "./ProfilePicture";

const $rdf = require("rdflib");
const auth = require('solid-auth-client')

const { default: data } = require('@solid/query-ldflex');
const FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = new $rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = new $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class App extends React.Component {

  constructor (props){
    super(props);

    this.state = {
      friendsModal: false,
      inboxModal: false,
      friends: [],
      messages: [],
      webId: ""
    }

    this.fetchMessages = this.fetchMessages.bind(this); 
    this.fetchFriends = this.fetchFriends.bind(this); 
    this.deleteFriend = this.deleteFriend.bind(this); 
  }

  toggleFriendsModal (){
    this.setState({ friendsModal: !this.state.friendsModal });
  }

  toggleInboxModal (){
    this.setState({ inboxModal: !this.state.inboxModal });
  }

  fetchMessages(){
    const inboxAdress = this.state.webId.replace("profile/card#me", "inbox/");

    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    var inbox = [];
    fetcher.load(inboxAdress).then((response) => {
      var messages = store.each($rdf.sym(inboxAdress), LDP("contains"));
      messages = messages.map(async (message) => {
        message = message.value
        await fetcher.load(message).then((response) => {
          var messageTypes = store.each($rdf.sym(message), RDF("type"));
          for(var i = 0; i<messageTypes.length; i++){
            if(messageTypes[i].value === "https://www.w3.org/ns/activitystreams#Announce"){
              let type = "Shared"
              let document = store.any($rdf.sym(message), $rdf.sym("https://www.w3.org/ns/activitystreams#object"));
              inbox.push([type, document.value])
            }
          };
        });
      });
      this.setState({
        messages: inbox
      })
    });
  }

  fetchFriends(){
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    //loading friends into state
    var friends = [];
    fetcher.load(this.state.webId).then((response) => {
      friends = store.each($rdf.sym(this.state.webId), FOAF("knows"));
      //console.log(friends)
      friends = friends.map(async (friend) => {
        var friendName = "";
        await fetcher.load(friend.value).then((response) => {
          friendName = store.any($rdf.sym(friend.value), FOAF("name"));
        })
        friends = this.state.friends
        friends.push({name: friendName.value, webId: friend.value});
        this.setState({friends: friends}); 
        return
      });
    });
  }

  deleteFriend(e){
    let friendToDelete = e.target.id;
    const store = $rdf.graph();
    const updater = new $rdf.UpdateManager(store);

    let ins = [];
    let del = $rdf.st($rdf.sym(this.state.webId), FOAF("knows"), $rdf.sym(friendToDelete), $rdf.sym(this.state.webId).doc());
    
    updater.update(del, ins, (uri, ok, message) => {
      if (ok) window.location.reload();
      else alert(message);
    });
  }

  fetchUser() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in")
      } else {
        this.setState({webId: session.webId})
        console.log(this.state.webId)
        this.fetchMessages();
        this.fetchFriends();
      }
    })
  }

  componentWillMount(){
    this.fetchUser();
  }

  render () { 
    return (
    <div>
      <header>
        <h1>Solid App</h1>
        <AuthButton popup="popup.html" login="Login here!" logout="Logout here!"/>
      </header>
      <main>
        <Container>
          <Row>
            <Col sm>
            </Col>
            <Col md>
              <LoggedIn>
                <ProfilePicture webId={this.state.webId}/>
                <Image src="user.image" defaultSrc="profile.svg" className="profile"/>
                <p>Welcome back, <Value src="user.name"/>.</p>
                <Button onClick={this.toggleFriendsModal.bind(this)}>Show Friends</Button>
                <Button onClick={this.toggleInboxModal.bind(this)}>Show Messages</Button>
                <VerticallyCenteredModal messages={this.state.messages} show={this.state.inboxModal} onHide={this.toggleInboxModal.bind(this)}></VerticallyCenteredModal>
                <VerticallyCenteredModal friends={this.state.friends} show={this.state.friendsModal} onHide={this.toggleFriendsModal.bind(this)} deleteFriend={this.deleteFriend.bind(this)}></VerticallyCenteredModal>
                <AddFriend/>
              </LoggedIn>
              <LoggedOut>
                <p>You are logged out.</p>
              </LoggedOut>
              </Col>
            <Col sm>
            </Col>              
          </Row>
        </Container>
      </main>
    </div>
  )};
}

export default App;