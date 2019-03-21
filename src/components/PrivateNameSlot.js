import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";
import Row from "react-bootstrap/Row";

const rdf = require("rdflib");
const auth = require("solid-auth-client");

const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/"); 


class PrivateNameSlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            webId:"",
            currentValue: this.props.name,
            newValue: this.props.name, // why both props.name? 
            editMode: false,
        };
    }

    fetchUser() {
        auth.trackSession(session => {
            if(!session) {
                console.log("You are not logged in");
            } else {
                this.setState({ webId: session.webId }); 
            }
        });
    }
    
    applyChanges() {
        const store = rdf.graph();
        const updater = new rdf.UpdateManager(store);
        const fetcher = new rdf.Fetcher(store);

        var del;
        var ins;
        console.log(this.state.webId);
        
        const webId = this.state.webId;
        const privateCard = this.state.webId.replace("profile/card#me", "public/card#me");
        console.log(privateCard); 

        del = rdf.st(rdf.sym(privateCard), FOAF("name"), rdf.lit(this.state.currentValue), rdf.sym(privateCard).doc());
        ins = rdf.st(rdf.sym(privateCard), FOAF("name"), rdf.lit(this.state.newValue), rdf.sym(privateCard).doc()); 
        console.log(this.state.currentValue);
        updater.update(del, ins, (uri, ok, message) => {
            if(ok) {
                let newValue = this.state.newValue;
                this.setState({editMode: false, currentValue: newValue});
            } 
            else alert(message);
        })
        

        fetcher.load(webId).then((response) => {

            del = rdf.st(rdf.sym(webId), FOAF("name"), rdf.lit(this.state.currentValue), rdf.sym(webId).doc()); 
            ins = rdf.st(rdf.sym(webId), FOAF("name"), rdf.lit(this.state.newValue), rdf.sym(webId).doc()); 

            updater.update(del, ins, (uri, ok, message) => {
                if(ok) {
                    console.log("updated Public turtle file lol");
                } 
                else alert(message);
            });

        });
    }

    getNewValue(e) {
        this.setState({newValue: e.target.value});
    }

    componentWillMount() {
        this.fetchUser(); 
    }

    toggleEditMode() {
        this.setState({editMode: !this.state.editMode}); 
    }

    render() {
        let slotMarkup = (this.state.editMode) ? 
        <FormControl placeholder={this.state.currentValue} 
        onChange={this.getNewValue.bind(this)}
        onBlur={this.applyChanges.bind(this)}
        defaultValue={this.state.currentValue}>
        </FormControl> : 
        <p onClick={this.toggleEditMode.bind(this)}>
            {this.state.currentValue}
        </p>
        return(
            <Row style={{border: "solid #FFF 5px", borderRadius: "10px", width: "100%"}}>
                <Col md="8">
                    <Row style = {{width: "100%"}}>
                        {slotMarkup}
                    </Row>
                </Col>
                <Col md="4">
                    <Row style = {{width: "100%"}}>
                        <PublicCardButton webId={this.props.webId} name={this.props.name}/>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default PrivateNameSlot;