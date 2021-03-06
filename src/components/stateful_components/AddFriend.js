import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const $rdf = require("rdflib");
const FOAF = new $rdf.Namespace("http://xmlns.com/foaf/0.1/");

class AddFriend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendToAdd: ""
    };
  }

  changeFriendToAdd(e) {
    this.setState({
      friendToAdd: e.target.value
    });
  }

  addFriend = () => {
    let webId = this.props.webID
    let friendToAdd = this.state.friendToAdd;
    const store = $rdf.graph();
    const updater = new $rdf.UpdateManager(store);

    let del = [];
    let ins = $rdf.st(
      $rdf.sym(webId),
      FOAF("knows"),
      $rdf.sym(friendToAdd),
      $rdf.sym(webId).doc()
    );
    updater.update(del, ins, (ok, uri, message) => {
      if (ok) console.log("Changes have been applied, reload page to see them");
      else alert(message);
    });
  }

  render() {
    return (
      <Form style={{ marginTop: 5 }}>
        <Form.Group>
          <Form.Label>Add a Friend:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your friends webId"
            onChange={this.changeFriendToAdd.bind(this)}
          />
          <Button onClick={this.addFriend} style={{ marginTop: 5 }}>
            Add
          </Button>
        </Form.Group>
      </Form>
    );
  }
}

export default AddFriend;
