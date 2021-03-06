import React from "react";
import PublicProfileField from "../functional_components/PublicProfileField";
import Container from "react-bootstrap/Container";

const auth = require("solid-auth-client");
const rdf = require("rdflib");

const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

class PublicProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            webId: this.props.webId,
            publicBio: "",
            publicName: "",
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

                const publicProfileCard = webId.replace("profile/card#me", "public/card");

                const store = rdf.graph();
                const fetcher = new rdf.Fetcher(store); 
                fetcher.load(publicProfileCard).then((response) => {
                    const publicName = store.any(rdf.sym(publicProfileCard + "#me"), FOAF("name"));
                    const publicNameValue = publicName ? publicName.value : "";
                    console.log(publicNameValue);
                    
                    const publicBio = store.any(rdf.sym(publicProfileCard + "#me"), VCARD("note"));
                    const publicBioValue = publicBio ? publicBio.value : ""; 
                    console.log(publicBioValue);

                    


                    this.setState({
                        publicBio: publicBioValue, 
                        publicName: publicNameValue,
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
                            <h3 style={{marginTop: "20px", marginBottom: "15px"}}>Public Profile Info</h3>
                            <PublicProfileField webId={this.state.webId} publicBio={this.state.publicBio} publicName={this.state.publicName}/>
                        </div>
                    </Container>
                </main>
            </div>
        )
    }
}

export default PublicProfile;
