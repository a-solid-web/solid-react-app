import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";
import FormControl from "react-bootstrap/FormControl";

const rdf = require("rdflib");
const auth = require("solid-auth-client");

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");

class NameSlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            webId: "",
            currentValue: this.props.name,
            newValue: this.props.name,
            editMode: false
        };
    }

    fetchUser() {
        auth.trackSession(session => {
          if (!session) {
            console.log("You are not logged in");
          } else {
            this.setState({ webId: session.webId });
          }
        });
    }

    applyChanges(){
        const store = rdf.graph();
        const updater = new rdf.UpdateManager(store);
  
        var del;
        var ins;
  
        del = rdf.st(rdf.sym(this.state.webId), FOAF("name"), rdf.lit(this.state.currentValue), rdf.sym(this.state.webId).doc());
        ins = rdf.st(rdf.sym(this.state.webId), FOAF("name"), rdf.lit(this.state.newValue), rdf.sym(this.state.webId).doc());
  
        updater.update(del, ins, (uri, ok, message) => {
            if(ok) {
                let newValue = this.state.newValue;
                this.setState({editMode: false, currentValue: newValue});
            }
            else alert(message);
        });
        this.setState({editMode: false});
    }

    getNewValue(e){
        this.setState({newValue: e.target.value})
    }
    
    componentWillMount() {
        this.fetchUser();
    }

    toggleEditMode(){
        this.setState({editMode: !this.state.editMode});
    }

    render(){
        let slotMarkup = (this.state.editMode) ? <FormControl placeholder={this.state.currentValue} onChange={this.getNewValue.bind(this)} onBlur={this.applyChanges.bind(this)} defaultValue={this.state.currentValue}></FormControl> : <p onClick={this.toggleEditMode.bind(this)}>{this.state.currentValue}</p>

        return (
            <Row style={{border: "solid #FFF 5px", borderRadius: "10", width: "100%"}}>
                <Col md="8">
                    <Row style={{width: "100%"}}>
                        {slotMarkup}
                    </Row>
                </Col>
                <Col md="4">
                    <Row style={{width: "100%"}}>
                        <PublicCardButton webId={this.props.webId} name={this.props.currentValue}/>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default NameSlot;