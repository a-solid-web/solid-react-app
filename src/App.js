import React from 'react';
import {
  AuthButton, LoggedIn, LoggedOut
} from '@solid/react';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VerticallyCenteredModal from './VerticallyCenteredModal';
import { ProfilePicture } from "./ProfilePicture";
import { AddPicture } from "./AddPicture";
import { ChangeProfilePicture } from './ChangeProfilePicture';

const $rdf = require("rdflib");
const auth = require('solid-auth-client')

const FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const LDP = new $rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = new $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const ACT = new $rdf.Namespace("https://www.w3.org/ns/activitystreams#");

class App extends React.Component {

  constructor (props){
    super(props);

    this.state = {
      friendsModal: false,
      inboxModal: false,
      friends: [],
      messages: [],
      webId: "",
      picture: ""
    }

    this.fetchMessages = this.fetchMessages.bind(this); 
    this.fetchFriends = this.fetchFriends.bind(this); 
    this.deleteFriend = this.deleteFriend.bind(this); 
    this.fetchPicture = this.fetchPicture.bind(this);
    this.setProfilePicture = this.setProfilePicture.bind(this);
  }

  toggleFriendsModal (){
    this.setState({ friendsModal: !this.state.friendsModal });
  }

  toggleInboxModal (){
    this.setState({ inboxModal: !this.state.inboxModal });
  }

  fetchMessages(){
    function getActor(actor){
      actor = actor.split(".")[0];
      console.log(actor)
      actor = actor.replace("https://", "");
      console.log(actor);
      return actor
    }
  
    function getAction(actions){
      for(var i = 0; i<actions.length; i++){
        if(actions[i].value === "https://www.w3.org/ns/activitystreams#Announce"){
          let type = "shared";
          return type
        }
      };
    }
  
    function getTime(time){
      time = time.split("T");
      let date = time[0];
      time = time[1].replace("Z", "");
      time = time.split(".")[0];
      return [date, time]
    }
  
    function getTopics(topics){
      var filteredTopics = [];
      for(var i = 0; i<topics.length; i++){
        var topic = topics[i].value
        if(topic !== "http://www.w3.org/ns/prov#Entity"){
          if (topic.indexOf("#") !== -1){
            topic = topic.split("#")[1];
            filteredTopics.push(topic)
          } else {
            topic = topic.split("/");
            topic = topic[topic.length - 1]
            filteredTopics.push(topic)
          }
        }
      };
      topics = "";
      for (i = 0; i < filteredTopics.length; i++){
        if (i === filteredTopics.length - 1){
          topics += filteredTopics[i];
        } else {
          topics += filteredTopics[i] + ", ";
        }
      }
      return topics
    }

    const inboxAdress = this.state.webId.replace("profile/card#me", "inbox/");

    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    var inbox = [];
    fetcher.load(inboxAdress).then((response) => {
      var messages = store.each($rdf.sym(inboxAdress), LDP("contains"));
      messages = messages.map(async (message) => {
        message = message.value
        const temp_store = $rdf.graph();
        const temp_fetcher = new $rdf.Fetcher(temp_store);
        await temp_fetcher.load(message).then((response) => {
          var action;
          var topics;
          var actor;
          var document;
          var time;

          var messageTypes = temp_store.each($rdf.sym(message), RDF("type"));
          action = (action) ? getAction(messageTypes) : "";

          actor = temp_store.any($rdf.sym(message), ACT("actor"));
          actor = (actor) ? getActor(actor.value) : "";

          document = temp_store.any(null, RDF("type"), $rdf.sym("http://rdfs.org/sioc/ns#Post"));
          document = (document) ? document.value : "";

          topics = (document) ? temp_store.each($rdf.sym(document), RDF("type")) : "";
          topics = topics ? getTopics(topics) : "";

          time = temp_store.any($rdf.sym(message), ACT("updated"));
          time = (time) ? getTime(time.value) : "";

          let inboxEntry = {action: action, actor: actor, document: document, time: time, topics: topics};
          topics = [];
          console.log(inboxEntry);
          inbox.push(inboxEntry);
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
        var friendPicture = "";
        await fetcher.load(friend.value).then((response) => {
          friendName = store.any($rdf.sym(friend.value), FOAF("name"));
          friendPicture = store.any($rdf.sym(friend.value), VCARD("hasPhoto"));
          if (friendPicture !== undefined) {
            friendPicture = friendPicture.value;
          } else {
            friendPicture = "";
          }
        })
        friends = this.state.friends
        friends.push({name: friendName.value, webId: friend.value, picture: friendPicture});
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
      if (ok) this.fetchFriends();
      else alert(message);
    });
  }

  fetchPicture() {
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);
    var picture = ""; 
    fetcher.load(this.state.webId).then((response) => {
      picture = store.any($rdf.sym(this.state.webId), VCARD("hasPhoto")); 
      if (picture) this.setState({picture: picture.value});
    });
  }

  setPicture(e){
    var filePath = e.target.files[0];
    var store = $rdf.graph();
    var fetcher = new $rdf.Fetcher(store);

    let webId = this.state.webId
    
    var reader = new FileReader()
    reader.onload = function () {
        var data = this.result
        var filename = encodeURIComponent(filePath.name)
        var contentType = "image"
        let pictureURl = webId.replace("card#me", filename)
        fetcher.webOperation('PUT', pictureURl, {data: data, contentType: contentType})
    }
    reader.readAsArrayBuffer(filePath)
  }

  setProfilePicture(e){
    var filePath = e.target.files[0];
    var store = $rdf.graph();
    var fetcher = new $rdf.Fetcher(store);

    let webId = this.state.webId
    let currentPicture = this.state.picture
    
    var reader = new FileReader()
    reader.onload = function () {
        var data = this.result;
        var filename = encodeURIComponent(filePath.name)
        var contentType = "image"
        let pictureURl = webId.replace("card#me", filename)
        fetcher.webOperation('PUT', pictureURl, {data: data, contentType: contentType}).then((response) => {
          if (response.status === 201) {
            const updater = new $rdf.UpdateManager(store);
            let del = $rdf.st($rdf.sym(webId), VCARD("hasPhoto"), $rdf.sym(currentPicture), $rdf.sym(webId).doc());
            let ins = $rdf.st($rdf.sym(webId), VCARD("hasPhoto"), $rdf.sym(pictureURl), $rdf.sym(webId).doc())
            updater.update(del, ins, (uri, ok, message) => {
              if (ok) console.log("Changes have been applied, reload page to see them");
              else alert(message)
            })
          }
        });
    }
    reader.readAsArrayBuffer(filePath)
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
        this.fetchPicture();
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
                <Row>
                  <Col md="8">
                    <ProfilePicture picture={this.state.picture}/>
                  </Col>
                  <Col md="4">
                    <Row><AddPicture onChange={this.setPicture.bind(this)}/></Row>
                    <Row><ChangeProfilePicture onChange={this.setProfilePicture.bind(this)}/></Row>
                  </Col>
                </Row>
                <Button onClick={this.toggleFriendsModal.bind(this)}>Show My Friends</Button>
                <Button onClick={this.toggleInboxModal.bind(this)} style={{marginLeft: 5}}>Show My Messages</Button>
                <VerticallyCenteredModal messages={this.state.messages} show={this.state.inboxModal} onHide={this.toggleInboxModal.bind(this)}></VerticallyCenteredModal>
                <VerticallyCenteredModal friends={this.state.friends} show={this.state.friendsModal} onHide={this.toggleFriendsModal.bind(this)} deleteFriend={this.deleteFriend.bind(this)}></VerticallyCenteredModal>
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