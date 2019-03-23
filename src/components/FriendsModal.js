import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import CardGroup from "react-bootstrap/CardGroup";
import { FriendSlot } from "./FriendSlot";
import AddFriend from "./AddFriend";

const $rdf = require("rdflib");
const auth = require("solid-auth-client");

const FOAF = new $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const ACL = new $rdf.Namespace("http://www.w3.org/ns/auth/acl#");

export default class FriendsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      webId: "",
      accessFilter: false
    };
  }

  fetchFriends = () => {
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    const permissionStore = $rdf.graph();
    const permissionFetcher = new $rdf.Fetcher(permissionStore);

    let viewerNode = this.state.webId.replace("card#me", "card.acl#viewer")
    permissionFetcher.load(viewerNode);

    //loading friends into state
    var friends = [];
    this.setState({friends: friends})

    fetcher.load(this.state.webId).then(response => {
      friends = store.each($rdf.sym(this.state.webId), FOAF("knows"));

      friends = friends.map(async friend => {
        var friendName = "";
        var friendPicture = "";
        var friendAccess = true;

        await fetcher.load(friend.value).then(response => {
          friendName = store.any($rdf.sym(friend.value), FOAF("name"));
          
          friendPicture = store.any($rdf.sym(friend.value), VCARD("hasPhoto"));
          friendPicture = friendPicture ? friendPicture.value : "";

          friendAccess = permissionStore.statementsMatching($rdf.sym(viewerNode), ACL("agent"), $rdf.sym(friend.value)).length > 0 ? true : false;
          //console.log(friend.value, friendAccess)
        });

        friends = this.state.friends;
        friends.push({
          name: friendName.value,
          webId: friend.value,
          access: friendAccess,
          picture: friendPicture
        });

        this.setState({ friends: friends });
        return;
      });
    });
  };

  deleteFriend = e => {
    let friendToDelete = e.target.id;
    const store = $rdf.graph();
    const updater = new $rdf.UpdateManager(store);

    let ins = [];
    let del = $rdf.st(
      $rdf.sym(this.state.webId),
      FOAF("knows"),
      $rdf.sym(friendToDelete),
      $rdf.sym(this.state.webId).doc()
    );

    updater.update(del, ins, (uri, ok, message) => {
      if (ok) this.fetchFriends();
      else alert(message);
    });
  };

  fetchUser() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        console.log("You are logged in")
        this.setState({ webId: session.webId });
        this.fetchFriends();
      }
    });
  }

  restrictAccess(e) {
    console.log("Giving access... to: ", e.target.id);
    var webId = e.target.id;
    let viewerNode = this.state.webId.replace("card#me", "card.acl#viewer");

    const store = $rdf.graph();
    const updater = new $rdf.UpdateManager(store);
    
    //const documentAddress = viewerNode.split("#")[0].replace(".acl", "#me");

    let del = [
      $rdf.st($rdf.sym(viewerNode), ACL("agent"), $rdf.sym(webId), $rdf.sym(viewerNode).doc()),
    ]
    let ins = [];

    updater.update(del, ins, (uri, ok, message) => {
        if (ok) console.log("Access denied");
        else console.log(message);
    })
    this.fetchUser();
  }

  giveAccess(e) {
    console.log("Giving access... to: ", e.target.id);
    var webId = e.target.id;
    let viewerNode = this.state.webId.replace("#me", ".acl#viewer");
    const settingsAddress = viewerNode.replace("#viewer", "");
    console.log(settingsAddress)
    const documentAddress = settingsAddress.split("#")[0].replace(".acl", "");
    
    const store = $rdf.graph();
    const updater = new $rdf.UpdateManager(store);
    const fetcher = new $rdf.Fetcher(store)

    fetcher.load(settingsAddress).then(() => {
      let del = [];
      let ins = [
        $rdf.st($rdf.sym(viewerNode), ACL("agent"), $rdf.sym(webId), $rdf.sym(viewerNode).doc()),
      ]

      updater.update(del, ins, (uri, ok, message) => {
          if (ok) console.log("Access given");
          else console.log(message);
      })
    }).catch((err) => {
      //Create new .acl file
      const ownerNode = this.state.webId.replace("card#me", "card.acl#owner")

      const newACLTriples = [
        $rdf.st($rdf.sym(ownerNode), ACL("agent"), $rdf.sym(this.state.webId), $rdf.sym(ownerNode).doc()),
        $rdf.st($rdf.sym(ownerNode), ACL("accessTo"), $rdf.sym(documentAddress), $rdf.sym(ownerNode).doc()),
        $rdf.st($rdf.sym(ownerNode), ACL("mode"), ACL("Control"), $rdf.sym(ownerNode).doc()),
        $rdf.st($rdf.sym(ownerNode), ACL("mode"), ACL("Read"), $rdf.sym(ownerNode).doc()),
        $rdf.st($rdf.sym(ownerNode), ACL("mode"), ACL("Write"), $rdf.sym(ownerNode).doc()),
        $rdf.st($rdf.sym(viewerNode), ACL("agent"), $rdf.sym(webId), $rdf.sym(viewerNode).doc()),
        $rdf.st($rdf.sym(viewerNode), ACL("accessTo"), $rdf.sym(documentAddress + "#me"), $rdf.sym(viewerNode).doc()),
        $rdf.st($rdf.sym(viewerNode), ACL("mode"), ACL("Read"), $rdf.sym(viewerNode).doc())
      ]

      updater.put($rdf.sym(settingsAddress), newACLTriples, "text/turtle", function(uri, ok , message){
        if (ok) console.log("New ACL File has been created");
        else console.log(message)
      })
    });
    
    this.fetchUser();
  }

  toggleAccessFilter(){
    this.setState({accessFilter: !this.state.accessFilter});
    this.fetchFriends();
  }

  componentWillMount() {
    this.fetchUser();
  }

  render() {
    let friendsMarkup = this.state.friends.map((friend, index) => {
      if (this.state.accessFilter){
        if(friend.access){
          return (
            <FriendSlot
              key={index}
              friend={friend}
              onClick={this.deleteFriend}
              changeAccess={
                friend.access ? this.restrictAccess.bind(this) : this.giveAccess.bind(this)
              }
            />
          );
        } else {
          return "";
        }
      } else {
        return (
          <FriendSlot
            key={index}
            friend={friend}
            onClick={this.deleteFriend}
            changeAccess={
              friend.access ? this.restrictAccess.bind(this) : this.giveAccess.bind(this)
            }
          />
        );
      }
    });

    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader>
          <ModalTitle id="contained-modal-title-vcenter">
            {this.props.id === "friendsButton" ? "My Friends" : "My Messages"}
          </ModalTitle>
          <Button onClick={this.toggleAccessFilter.bind(this)}>Filter for Access</Button>
        </ModalHeader>
        <ModalBody>
          <CardGroup>{friendsMarkup}</CardGroup>
          <AddFriend webID={this.state.webId}/>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.onHide} id={this.props.id === "friendsButton" ? "friendsButton" : "privacyButton"}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
