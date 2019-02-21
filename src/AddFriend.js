import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const $rdf = require("rdflib");
const FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');

class AddFriend extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            friendToAdd: ""
        }
    }

    changeFriendToAdd(e){
        this.setState({
            friendToAdd: e.target.value
        });
    }

    addFriend(){
        let friendToAdd = this.state.friendToAdd
        const store = $rdf.graph();
        const updater = new $rdf.UpdateManager(store);

        const webId = "https://ludwigschubert.solid.community/profile/card#me";

        let del = [];
        let ins = $rdf.st($rdf.sym(webId), FOAF("knows"), $rdf.sym(friendToAdd), $rdf.sym(webId).doc());
        updater.update(del, ins, (ok, uri, message) => {
            if (ok) console.log("Added Friend.");
            else alert(message);
        });
    }

    render() {
        return (
            <Form onSubmit={this.addFriend.bind(this)}>
                <Form.Group>
                    <Form.Label>Enter webID:</Form.Label>
                    <Form.Control type="text" placeholder="Enter your friends webID" onChange={this.changeFriendToAdd.bind(this)}/>
                    <Button type="submit">Submit</Button>
                </Form.Group>
            </Form>
        )
    }
}

export default AddFriend;