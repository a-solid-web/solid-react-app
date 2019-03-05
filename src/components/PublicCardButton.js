import React from "react";
import Button from "react-bootstrap/Button";


const $rdf = require("rdflib");
const auth = require("solid-auth-client");

const FOAF = new $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const ACL = new $rdf.Namespace("http://www.w3.org/ns/auth/acl#");


export default class PublicCardButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            webId: this.props.webId
        };
    }

    giveAccess(e) {
        console.log("Adding information to public profile");
        var webId = this.state.webId;
        const publicCard = this.state.webId.replace("profile/card#me", "public/card");
        let viewerNode = this.state.webId.replace("profile/card#me", "public/card.acl#viewer");
        const settingsAddress = viewerNode.replace("#viewer", "");
        console.log(settingsAddress)
        // const documentAddress = settingsAddress.replace(".acl", "");

        const store = $rdf.graph();
        const updater = new $rdf.UpdateManager(store);
        const fetcher = new $rdf.Fetcher(store);

        fetcher.load(settingsAddress).then(() => {
            let del = [];
            let ins = [
                $rdf.st($rdf.sym(viewerNode), ACL("agent"), $rdf.sym(webId), $rdf.sym(viewerNode).doc()),
                // $rdf.st($rdf.sym(publicCard), "don't know", )
            ]

            updater.update(del, ins, (uri, ok, message) => {
                if(ok) console.log("ACL file for public folder creared")
            })
        }).catch((err) => {
            // Create new .acl file 
            const ownerNode = viewerNode.replace("#viewer", "owner");

            const newACLTriples = [
                $rdf.st($rdf.sym(ownerNode), ACL("agent"), $rdf.sym(webId), $rdf.sym(ownerNode).doc()),
                $rdf.st($rdf.sym(ownerNode), ACL("accessTo"), $rdf.sym(publicCard), $rdf.sym(ownerNode).doc()),
                $rdf.st($rdf.sym(ownerNode), ACL("mode"), ACL("Control"), $rdf.sym(ownerNode).doc()),
                $rdf.st($rdf.sym(ownerNode), ACL("mode"), ACL("Read"), $rdf.sym(ownerNode).doc()),
                $rdf.st($rdf.sym(ownerNode), ACL("mode"), ACL("Write"), $rdf.sym(ownerNode).doc()),
                $rdf.st($rdf.sym(viewerNode), ACL("agentClass"), FOAF("Agent"), $rdf.sym(viewerNode).doc()),
                $rdf.st($rdf.sym(viewerNode), ACL("accessTo"), $rdf.sym(publicCard), $rdf.sym(viewerNode).doc()),
                $rdf.st($rdf.sym(viewerNode), ACL("mode"), ACL("Read"), $rdf.sym(viewerNode).doc())
            ]
        })

    }
    render() {
        return (
            <Button>Make public</Button>
        )
    }
}