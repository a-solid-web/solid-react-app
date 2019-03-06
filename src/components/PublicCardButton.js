import React from "react";
import Button from "react-bootstrap/Button";


const rdf = require("rdflib");

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const RDF = new rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const ACL = new rdf.Namespace("http://www.w3.org/ns/auth/acl#");


export default class PublicCardButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            webId: this.props.webId
        };
    }

    makePublic() {
        var webId = this.state.webId;
        const publicCard = this.state.webId.replace("profile/card#me", "public/card");
        let viewerNode = this.state.webId.replace("profile/card#me", "public/card.acl#viewer");
        const settingsAddress = viewerNode.replace("#viewer", "");
        console.log(settingsAddress)
        // const documentAddress = settingsAddress.replace(".acl", "");

        const store = rdf.graph();
        const updater = new rdf.UpdateManager(store);
        const fetcher = new rdf.Fetcher(store);

        var statementToAdd;

        const emailToAdd = this.props.email ? this.props.email : undefined;
        if(emailToAdd){
            const blankNode = "id" + String(Math.floor(Math.random() * 1000000))
            statementToAdd = [
<<<<<<< HEAD
                rdf.st(rdf.sym(publicCard + "#me"), FOAF("hasEmail"), rdf.sym(publicCard + "#" + blankNode), rdf.sym(publicCard).doc()),
                rdf.st(rdf.sym(publicCard + "#" + blankNode), VCARD("value"), rdf.sym(emailToAdd), rdf.sym(publicCard).doc())
=======
                rdf.st(rdf.sym(publicCard + "#me"), FOAF("hasEmail"), rdf.sym(publicCard + "#"  + blankNode), rdf.sym(publicCard).doc()),
                rdf.st(rdf.sym(publicCard + "#"  + blankNode), VCARD("value"), rdf.sym(emailToAdd), rdf.sym(publicCard).doc())
>>>>>>> debec3d0bac220356bc25c074d47c58351085407
            ]
        }

        const nameToAdd = this.props.name ? this.props.name : undefined;
        if(nameToAdd){
            statementToAdd = rdf.st(rdf.sym(publicCard + "#me"), FOAF("name"), rdf.lit(nameToAdd), rdf.sym(publicCard).doc())
        }

        const jobToAdd = this.props.job ? this.props.job : undefined;
        if(jobToAdd){
            statementToAdd = rdf.st(rdf.sym(publicCard + "#me"), VCARD("role"), rdf.lit(jobToAdd), rdf.sym(publicCard).doc())
        }

        const telephoneToAdd = this.props.telephone ? this.props.telephone : undefined;
        if(telephoneToAdd){
            const blankNode = "id" + String(Math.floor(Math.random() * 1000000))
<<<<<<< HEAD
            console.log(store.bnode(blankNode));
            statementToAdd = [
                rdf.st(rdf.sym(publicCard + "#me"), FOAF("hasTelephone"), rdf.sym(publicCard + "#" + blankNode), rdf.sym(publicCard).doc()),
                rdf.st(rdf.sym(publicCard + "#" + blankNode), VCARD("value"), rdf.sym(telephoneToAdd),rdf.sym(publicCard).doc())
=======
            statementToAdd = [
                rdf.st(rdf.sym(publicCard + "#me"), FOAF("hasTelephone"), rdf.sym(publicCard + "#"  + blankNode), rdf.sym(publicCard).doc()),
                rdf.st(rdf.sym(publicCard + "#"  + blankNode), VCARD("value"), rdf.sym(telephoneToAdd), rdf.sym(publicCard).doc())
>>>>>>> debec3d0bac220356bc25c074d47c58351085407
            ]
        }

        const bioToAdd = this.props.bio ? this.props.bio : undefined;
        if(bioToAdd){
            statementToAdd = rdf.st(rdf.sym(publicCard + "#me"), VCARD("note"), rdf.lit(bioToAdd), rdf.sym(publicCard).doc())
        }

        var statementToDelete; 

        fetcher.load(publicCard).then(() => {
            if(bioToAdd) {
                statementToDelete = store.statementsMatching(rdf.sym(publicCard + "#me"), VCARD("note"), null, rdf.sym(publicCard).doc());
            }

            let del = [statementToDelete[0]];
            console.log(statementToDelete[0])

            var ins;
            if (Array.isArray(statementToAdd)){
                ins = [
                    statementToAdd[0],
                    statementToAdd[1]
                ]
            } else {
                ins = [
                    statementToAdd
                ]
            }
            console.log(ins)

            updater.update(del, ins, (uri, ok, message) => {
                if(ok) console.log("Data has been made public")
            })
        }).catch((err) => {
            const publicId = publicCard + "#me";

            var newPublicProfile;
            if (Array.isArray(statementToAdd)){
                newPublicProfile = [
                    rdf.st(rdf.sym(publicId), RDF("type"), FOAF("Person")),
                    rdf.st(rdf.sym(publicId), FOAF("name"), rdf.lit(publicId.split(".")[0].replace("https://", ""))),
                    statementToAdd[0],
                    statementToAdd[1]
                ]
            } else {
                newPublicProfile = [
                    rdf.st(rdf.sym(publicId), RDF("type"), FOAF("Person")),
                    rdf.st(rdf.sym(publicId), FOAF("name"), rdf.lit(publicId.split(".")[0].replace("https://", ""))),
                    statementToAdd
                ]
            }

            updater.put(rdf.sym(publicCard), newPublicProfile, "text/turtle", function(uri, ok , message){
                if (ok) console.log("New public card has been created");
                else console.log(message)
            })

            // Create new .acl file 
            const ownerNode = viewerNode.replace("#viewer", "owner");

            const newACLTriples = [
                rdf.st(rdf.sym(ownerNode), ACL("agent"), rdf.sym(webId), rdf.sym(ownerNode).doc()),
                rdf.st(rdf.sym(ownerNode), ACL("accessTo"), rdf.sym(publicCard), rdf.sym(ownerNode).doc()),
                rdf.st(rdf.sym(ownerNode), ACL("mode"), ACL("Control"), rdf.sym(ownerNode).doc()),
                rdf.st(rdf.sym(ownerNode), ACL("mode"), ACL("Read"), rdf.sym(ownerNode).doc()),
                rdf.st(rdf.sym(ownerNode), ACL("mode"), ACL("Write"), rdf.sym(ownerNode).doc()),
                rdf.st(rdf.sym(viewerNode), ACL("agentClass"), FOAF("Agent"), rdf.sym(viewerNode).doc()),
                rdf.st(rdf.sym(viewerNode), ACL("accessTo"), rdf.sym(publicCard), rdf.sym(viewerNode).doc()),
                rdf.st(rdf.sym(viewerNode), ACL("mode"), ACL("Read"), rdf.sym(viewerNode).doc())
            ]

            updater.put(rdf.sym(publicCard + ".acl"), newACLTriples, "text/turtle", function(uri, ok , message){
                if (ok) console.log("New ACL File has been created");
                else console.log(message)
            })
        })
    }

    render() {
        return (
            <Button onClick={this.makePublic.bind(this)}>Make public</Button>
        )
    }
}