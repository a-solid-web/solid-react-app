import React from "react";
import PrivateProfileField from "./PrivateProfileField";
import Container from "react-bootstrap/Container";

const auth = require("solid-auth-client");
const rdf = require("rdflib");

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class PrivateProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            webId: this.props.webId,
            bio: "",
            name: "",
            role: "",
        }
    }

    fetchUser() {
        auth.trackSession(session => {
            if (!session) {
                console.log("You are not logged in")
            } else {
                console.log("You are logged in.. Fetching your public Data")

                const webId = session.webId;
                this.setState({webId: webId});
                console.log(webId)

                const privateProfileCard = webId.replace("profile/card#me", "public/card");

                const store = rdf.graph();
                const fetcher = new rdf.Fetcher(store); 
                fetcher.load(privateProfileCard).then((response) => {
                    const name = store.any(rdf.sym(privateProfileCard + "#me"), FOAF("name"));
                    const nameValue = name ? name.value : "";
                    console.log(nameValue);
                    
                    const bio = store.any(rdf.sym(privateProfileCard + "#me"), VCARD("note"));
                    const bioValue = bio ? bio.value : ""; 
                    console.log(bioValue);

                    const role = store.any(rdf.sym(privateProfileCard + "#me"), VCARD("role"));
                    const roleValue = role? role.value : ""; 
                    console.log(roleValue); 


                    this.setState({
                        bio: bioValue, 
                        name: nameValue,
                        role: roleValue,
                    })

                    console.log(this.state); 

                });
            }
        });
    }

    componentWillMount() {
        this.fetchUser(); 
    }

    render(){
        return (
            <div style={{marginTop: "100px"}}>
                <main>
                    <Container>
                        <div style={{marginBottom:"15px"}}>
                            <h3 style={{marginTop: "20px", marginBottom: "15px"}}>Private Profile Info</h3>
                            <PrivateProfileField webId={this.state.webId} bio={this.state.bio} name={this.state.name} role={this.state.role}/>
                        </div>
                    </Container>
                </main>
            </div>
        )
    }
}

export default PrivateProfile;
