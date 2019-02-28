import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Messages } from "./Messages";

const $rdf = require("rdflib");

const LDP = new $rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = new $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const ACT = new $rdf.Namespace("https://www.w3.org/ns/activitystreams#");

class Inbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      webId: this.props.webId,
      messages: []
    };
  }

  fetchMessages = () => {
    function getActor(actor) {
      actor = actor.split(".")[0];
      actor = actor.replace("https://", "");
      return actor;
    }

    function getAction(actions) {
      for (var i = 0; i < actions.length; i++) {
        if (
          actions[i].value === "https://www.w3.org/ns/activitystreams#Announce"
        ) {
          let type = "shared";
          return type;
        }
      }
    }

    function getTime(time) {
      time = time.split("T");
      let date = time[0];
      time = time[1].replace("Z", "");
      time = time.split(".")[0];
      return [date, time];
    }

    function getTopics(topics) {
      var filteredTopics = [];
      for (var i = 0; i < topics.length; i++) {
        var topic = topics[i].value;
        if (topic !== "http://www.w3.org/ns/prov#Entity") {
          if (topic.indexOf("#") !== -1) {
            topic = topic.split("#")[1];
            filteredTopics.push(topic);
          } else {
            topic = topic.split("/");
            topic = topic[topic.length - 1];
            filteredTopics.push(topic);
          }
        }
      }
      topics = "";
      for (i = 0; i < filteredTopics.length; i++) {
        if (i === filteredTopics.length - 1) {
          topics += filteredTopics[i];
        } else {
          topics += filteredTopics[i] + ", ";
        }
      }
      return topics;
    }

    const inboxAdress = this.state.webId.replace("profile/card#me", "inbox/");

    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    var inbox = [];
    fetcher.load(inboxAdress).then(response => {
      var messages = store.each($rdf.sym(inboxAdress), LDP("contains"));
      messages = messages.map(async message => {
        message = message.value;
        const temp_store = $rdf.graph();
        const temp_fetcher = new $rdf.Fetcher(temp_store);
        await temp_fetcher.load(message).then(response => {
          var action;
          var topics;
          var actor;
          var document;
          var time;

          var messageTypes = temp_store.each($rdf.sym(message), RDF("type"));

          action = action ? getAction(messageTypes) : "";

          actor = temp_store.any($rdf.sym(message), ACT("actor"));
          actor = actor ? getActor(actor.value) : "";

          document = temp_store.any(
            null,
            RDF("type"),
            $rdf.sym("http://rdfs.org/sioc/ns#Post")
          );
          document = document ? document.value : "";

          topics = document
            ? temp_store.each($rdf.sym(document), RDF("type"))
            : "";
          topics = topics ? getTopics(topics) : "";

          time = temp_store.any($rdf.sym(message), ACT("updated"));
          time = time ? getTime(time.value) : "";

          let inboxEntry = {
            action: action,
            actor: actor,
            document: document,
            time: time,
            topics: topics
          };
          topics = [];
          inbox.push(inboxEntry);
        });
      });
      console.log(inbox, "Setting state!");
      this.setState({
        messages: inbox
      });
    });
  };

  componentWillMount() {
    this.fetchMessages();
  }

  render() {
    return <Messages messages={this.state.messages} />;
  }
}

export default Inbox;
