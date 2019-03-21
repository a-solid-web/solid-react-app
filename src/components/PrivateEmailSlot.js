import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PublicCardButton from "./PublicCardButton";
import FormControl from "react-bootstrap/FormControl";


const rdf = require("rdflib");
const auth = require("solid-auth-client");

const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class PrivateEmailSlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            webId: "",
            currentValue: this.props.email,
            newValue: this.props.email[0].split(":")[1],
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

    applyChanges() {
        const store = rdf.graph();
        const updater = new rdf.UpdateManager(store); 
        const fetcher = new rdf.Fetcher(store);

        var del;
        var ins;
        var publicCard;
        var currentId;
        var emailBLankNode;
        
        const webId = this.state.webId;
        const privateCard = webId.replace("profile/card#me", "public/card#me");
        console.log(privateCard);


        del = rdf.st(rdf.sym(this.state.currentValue[1]), VCARD("value"), rdf.sym(this.state.currentValue[0]), rdf.sym(privateCard).doc());
        ins = rdf.st(rdf.sym(this.state.currentValue[1]), VCARD("value"), rdf.sym("mailto:" + this.state.newValue), rdf.sym(privateCard).doc());

        updater.update(del, ins, (uri, ok, message) => {
            if(ok) {
                let newValue = ["mailto:" + this.state.newValue, this.state.currentValue[1]];
                this.setState({editMode: false, currentValue: newValue}); 
            }

            else alert(message); 
        })
        

        fetcher.load(webId).then((response) => {
            currentId = this.state.currentValue[1].split("#")[1];
            publicCard = webId.replace("#me", "");

            emailBLankNode = publicCard + "#" + currentId;

            del = rdf.st(rdf.sym(emailBLankNode), VCARD("value"), rdf.sym(this.state.currentValue[0]), rdf.sym(webId).doc());
            ins = rdf.st(rdf.sym(emailBLankNode), VCARD("value"), rdf.sym("mailto:" + this.state.newValue), rdf.sym(webId).doc()); 
            updater.update(del, ins, (uri, ok, message) => {
                if(ok) {
                    console.log("updated Public profile")
                } else alert(message); 
            })
        })

    }


    getNewValue(e) {
        this.setState({newValue: e.target.value})
    }

    componentWillMount() {
        this.fetchUser();
    }

    toggleEditMode() {
        this.setState({editMode: !this.state.editMode});
    }

    render() {
        let slotMarkup = (this.state.editMode) ? 
        <FormControl placeholder={this.state.currentValue[0].split(":")[1]} 
                    onChange={this.getNewValue.bind(this)} 
                    onBlur={this.applyChanges.bind(this)} 
                    defaultValue={this.state.currentValue[0].split(":")[1]}>
        </FormControl> : 
        <p onClick={this.toggleEditMode.bind(this)}>
            {this.state.currentValue[0].split(":")[1]}
        </p>
        return (
            <Row style = {{border: "solid #FFF 5px", borderRadius: "10px", width: "100%"}}>
                <Col md="8">
                    <Row style={{width: "100%"}}>
                        {slotMarkup}
                    </Row>
                </Col>
                <Col md="4">
                    <Row style={{width: "100%"}}>
                        <PublicCardButton webId={this.props.webId} email={this.props.email[0]}/>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default PrivateEmailSlot;
