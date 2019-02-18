import React from 'react';
import {
  AuthButton, LoggedIn, LoggedOut,
  Value, Image
} from '@solid/react';
import Button from "react-bootstrap/Button";
import VerticallyCenteredModal from './VerticallyCenteredModal';

const $rdf = require("rdflib");
const FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = new $rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = new $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");

class App extends React.Component {

  constructor (props){
    super(props);

    this.state = {
      friendsModal: false,
      inboxModal: false,
      friends: [],
      messages: []
    }
  }

  componentWillMount(){
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    const person = "https://ludwigschubert.solid.community/profile/card#me";

    //loading friends into state
    var friends = [];
    fetcher.load(person).then((response) => {
      friends = store.each($rdf.sym(person), FOAF("knows"));
      //console.log(friends)
      friends = friends.map(async (friend) => {
        var friendName = "";
        await fetcher.load(friend.value).then((response) => {
          friendName = store.any($rdf.sym(friend.value), FOAF("name"));
        })
        friends = this.state.friends
        friends.push(friendName.value);
        this.setState({friends: friends}); 
        return
      });
    });

    //loading messages into state
    const inboxAddress = person.replace("profile/card#me", "inbox/");
    var inbox = [];
    fetcher.load(inboxAddress).then((response) => {
      var messages = store.each($rdf.sym(inboxAddress), LDP("contains"));
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

  toggleFriendsModal (){
    this.setState({ friendsModal: !this.state.friendsModal });
  }

  toggleInboxModal (){
    this.setState({ inboxModal: !this.state.inboxModal });
  }

  render () { 
    return (
    <div>
      <header>
        <h1>Solid App</h1>
        <AuthButton popup="popup.html" login="Login here!" logout="Logout here!"/>
      </header>
      <main>
        <LoggedIn>
          <Image src="user.image" defaultSrc="profile.svg" className="profile"/>
          <p>Welcome back, <Value src="user.name"/>.</p>
          <h2>Friends</h2>
          <Button onClick={this.toggleFriendsModal.bind(this)}>Show Friends</Button>
          <Button onClick={this.toggleInboxModal.bind(this)}>Show Messages</Button>
          <VerticallyCenteredModal messages={this.state.messages} show={this.state.inboxModal} onHide={this.toggleInboxModal.bind(this)}></VerticallyCenteredModal>
          <VerticallyCenteredModal friends={this.state.friends} show={this.state.friendsModal} onHide={this.toggleFriendsModal.bind(this)}></VerticallyCenteredModal>
        </LoggedIn>
        <LoggedOut>
          <p>You are logged out.</p>
        </LoggedOut>
      </main>
    </div>
  )};
}

export default App;