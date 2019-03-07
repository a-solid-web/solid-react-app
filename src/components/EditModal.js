import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

const rdf = require("rdflib");
const auth = require("solid-auth-client");

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

export default class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: "",
      currentValue: this.props.currentvalue,
      newValue: ""
    };
  }

  fetchUser() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        console.log("You are logged in")
        this.setState({ webId: session.webId });
      }
    });
  }

  applyChanges(){
      const store = rdf.graph();
      const updater = new rdf.UpdateManager(store);

      var del;
      var ins;

      switch(this.props.context){
          case "email address":
            del = rdf.st(rdf.sym(this.state.currentValue[1]), VCARD("value"), rdf.sym(this.state.currentValue[0]), rdf.sym(this.state.webId).doc());
            ins = rdf.st(rdf.sym(this.state.currentValue[1]), VCARD("value"), rdf.sym("mailto:" + this.state.newValue), rdf.sym(this.state.webId).doc());
            break;
          case "job title":
            del = rdf.st(rdf.sym(this.state.webId), VCARD("role"), rdf.lit(this.state.currentValue), rdf.sym(this.state.webId).doc());
            ins = rdf.st(rdf.sym(this.state.webId), VCARD("role"), rdf.lit(this.state.newValue), rdf.sym(this.state.webId).doc());
            break;
          case "name":
            del = rdf.st(rdf.sym(this.state.webId), FOAF("name"), rdf.lit(this.state.currentValue), rdf.sym(this.state.webId).doc());
            ins = rdf.st(rdf.sym(this.state.webId), FOAF("name"), rdf.lit(this.state.newValue), rdf.sym(this.state.webId).doc());
            break;
          case "telephone number":
            del = rdf.st(rdf.sym(this.state.currentValue[1]), VCARD("value"), rdf.sym(this.state.currentValue[0]), rdf.sym(this.state.webId).doc());
            ins = rdf.st(rdf.sym(this.state.currentValue[1]), VCARD("value"), rdf.sym("tel:" + this.state.newValue), rdf.sym(this.state.webId).doc());
            break;
          case "bio":
            del = rdf.st(rdf.sym(this.state.webId), VCARD("note"), rdf.lit(this.state.currentValue), rdf.sym(this.state.webId).doc());
            ins = rdf.st(rdf.sym(this.state.webId), VCARD("note"), rdf.lit(this.state.newValue), rdf.sym(this.state.webId).doc());
            break;
      }

      updater.update(del, ins, (uri, ok, message) => {
          if(ok) console.log("Changes have been applied");
          else alert(message);
      });
  }

  getNewValue(e){
    this.setState({newValue: e.target.value})
  }

  componentWillMount() {
    this.fetchUser();
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader>
          <ModalTitle id="contained-modal-title-vcenter">
          Edit {this.props.context}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
            <InputGroup>
                <FormControl placeholder={"Enter your " + this.props.context} onChange={this.getNewValue.bind(this)} defaultValue={Array.isArray(this.state.currentValue) ? this.state.currentValue[0] : this.state.currentValue}></FormControl>
            </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.applyChanges.bind(this)}>
            Submit
          </Button>
          <Button onClick={this.props.onHide}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
