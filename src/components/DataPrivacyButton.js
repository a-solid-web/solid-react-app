import React from "react";
import Button from "react-bootstrap/Button";

const rdf = require("rdflib");
const auth = require("solid-auth-client");

const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class DataPrivacyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            webId: this.props.webId,
            dataStatus: "",
            statementToAdd: [],
            statementToDelete: []
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

    fetchDataFromPublic() {
        const store = rdf.graph(); 
        const fetcher = new rdf.Fetcher(store); 

        var currentId;
        var publicCard;
        var emailBlankNode; 
        var dataStatus;
        var dataStatusValue;
        

        currentId = this.props.currentValue[1].split("#")[1];
        publicCard = this.state.webId.replace("#me", "");
        emailBlankNode = publicCard + "#" + currentId;
        console.log(emailBlankNode);

        fetcher.load(this.state.webId).then((response) => { 
            console.log(response);
            dataStatus = store.any(rdf.sym(emailBlankNode), VCARD('value'));
            dataStatusValue = dataStatus.value; 
            console.log(dataStatusValue);

        }).then(() => {
            if(dataStatusValue === "request Access") {
                this.setState({dataStatus: true}); 
            } else {
                this.setState({dataStatus: false});  
            }
            console.log(this.state.dataStatus);
        })

    }
    makePrivate() {
        var webId = this.state.webId;
        
        const store = rdf.graph();
        const updater = new rdf.UpdateManager(store); 
        const fetcher = new rdf.Fetcher(store);

        var currentId;
        var publicCard;
        var emailBlankNode; 
        var statementToDelete;
        var statementToAdd;

        const emailToDelete = this.props.email ? this.props.email : undefined; 
        if(emailToDelete) {
            currentId = this.props.currentValue[1].split("#")[1];
            publicCard = this.state.webId.replace("#me", "");

            emailBlankNode = publicCard + "#" + currentId;
            
            statementToDelete = rdf.st(rdf.sym(emailBlankNode), VCARD("value"), rdf.sym(this.props.currentValue[0]), rdf.sym(this.state.webId).doc()); 
            statementToAdd = rdf.st(rdf.sym(emailBlankNode), VCARD("value"), rdf.lit("request Access"), rdf.sym(this.state.webId).doc());


        }

        fetcher.load(webId).then(() => {

            let del = statementToDelete;
            let ins = statementToAdd; 

            updater.update(del, ins, (uri, ok, message) => {
                if(ok) {
                    console.log("data has been made private");
                } else {
                    console.log(message); 
                }
            });
        })
    }

    makePublic() {
        var webId = this.state.webId; 

        const store = rdf.graph();
        const fetcher = new rdf.Fetcher(store);
        const updater = new rdf.UpdateManager(store); 


        var currentId;
        var publicCard;
        var emailBlankNode;
        var statementToAdd; 
        var statementToDelete; 
        
        
        const emailToAdd = this.props.email ? this.props.email : undefined; 
        if(emailToAdd) {
            currentId = this.props.currentValue[1].split("#")[1];
            publicCard = this.state.webId.replace("#me", "");
            emailBlankNode = publicCard + "#" + currentId; 

            statementToAdd = rdf.st(rdf.sym(emailBlankNode), VCARD("value"), rdf.sym(this.props.currentValue[0]), rdf.sym(this.state.webId).doc());
            statementToDelete = rdf.st(rdf.sym(emailBlankNode), VCARD("value"), rdf.lit("request Access"), rdf.sym(this.state.webId).doc()); 
            
        }

        fetcher.load(webId).then(() => {
            let del = statementToDelete;
            let ins = statementToAdd;

            updater.update(del, ins, (uri, ok, message) => {
                if(ok) {
                    console.log("Made Email Public");
                } else {
                    console.log(message); 
                }
            })
        })



    }

    componentWillMount() {
        this.fetchUser(); 
        this.fetchDataFromPublic(); 
    }

    render() {
        return(
        <Button onClick={ this.state.dataStatus ? this.makePublic.bind(this) : this.makePrivate.bind(this)}>{this.state.dataStatus ? "Make Public" : "Make Private"}</Button>
        )
    }
}

export default DataPrivacyButton; 
