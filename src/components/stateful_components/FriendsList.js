import React from "react";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import FriendThumbnail from "../functional_components/FriendThumbnail";

const rdf = require("rdflib");
const auth = require("solid-auth-client");

//const RDF = new rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const ACL = new rdf.Namespace("http://www.w3.org/ns/auth/acl#");
//const MEET = new rdf.Namespace("http://www.w3.org/ns/pim/meeting#");
//const DC = new rdf.Namespace("http://purl.org/dc/elements/1.1/");
//const FLOW = new rdf.Namespace("http://www.w3.org/2005/01/wf/flow#");
//const SIOC = new rdf.Namespace("http://rdfs.org/sioc/ns#");
//const TERMS = new rdf.Namespace("http://purl.org/dc/terms/");

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: "",
      friends: []
    };
  }

  fetchFriends = () => {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const permissionStore = rdf.graph();
    const permissionFetcher = new rdf.Fetcher(permissionStore);

    let viewerNode = this.state.webId.replace("card#me", "card.acl#viewer");
    permissionFetcher.load(viewerNode);

    //loading friends into state
    var friends = [];
    this.setState({ friends: friends });

    fetcher.load(this.state.webId).then(response => {
      friends = store.each(rdf.sym(this.state.webId), FOAF("knows"));

      friends = friends.map(async friend => {
        var friendName = "";
        var friendPicture = "";
        var friendAccess = true;

        await fetcher.load(friend.value).then(response => {
          friendName = store.any(rdf.sym(friend.value), FOAF("name"));

          friendPicture = store.any(rdf.sym(friend.value), VCARD("hasPhoto"));
          friendPicture = friendPicture ? friendPicture.value : "";

          friendAccess =
            permissionStore.statementsMatching(
              viewerNode,
              ACL("agent"),
              rdf.sym(friend.value)
            ).length > 0
              ? true
              : false;
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

  fetchUser() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        console.log("You are logged in... Fetching your data now");
        this.setState({ webId: session.webId });
        this.fetchFriends();
      }
    });
  }

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    let friendsMarkup = this.state.friends.map((friend, index) => {
      return <FriendThumbnail friend={friend} index={index} />;
    });

    // let friendProfileMarkup = this.state.friends.map((friend, index) => {
    //     return (<FriendProfile friend={friend} index={index}/>)
    // })

    return (
      <Container>
        <Tab.Container>
          <Row>
            <Col lg={{ span: 2 }}>
              <ListGroup>{friendsMarkup}</ListGroup>
            </Col>
            <Col lg={{ span: 10 }}>
              <Tab.Content />
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    );
  }
}
