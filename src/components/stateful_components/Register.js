import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { createHash } from "crypto";

class Register extends React.Component {
    
    registerUser () {

        var xhr = new XMLHttpRequest();
        var url = "https://solid.community/api/accounts/new"

        xhr.onreadystatechange = () => {
            if( xhr.response == XMLHttpRequest.DONE) {
                if(xhr.status == 403) {
                    console.log("account already exists");
                } else {
                    console.log("account successfully created, LOGIN now!")
                }
            }
        }

        xhr.open("POST", url);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var username = document.getElementById("username").value
        var password = document.getElementById("password").value
        var repeatPassword = document.getElementById("repeat-password").value
        var name = document.getElementById("name").value
        var email = document.getElementById("email").value
        
        xhr.send("username="+username+"&password="+password+"&repeat_password="+repeatPassword+"&name="+name+"&email="+email) 
    }
    render () {
        return (
            <Container>
                <Row style={{marginTop: "5%"}}>
                    <Form>
                        <Form.Label>Enter username</Form.Label>
                        <Form.Control id="username" type="text" name="username"/>
                        <Form.Label>Enter password</Form.Label>
                        <Form.Control id="password" type="password" name="password"/>
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control id="repeat-password" type="password" name="repeat_password"/>
                        <Form.Label>Enter name</Form.Label>
                        <Form.Control id="name" type="text" name="name"/>
                        <Form.Label>Enter email</Form.Label>
                        <Form.Control id="email" type="text" name="email"/>
                        {/* <Form.Control type="hidden" name="redirect_uri" value/> */}
                        <Button style={{marginTop: "5%"}} onClick={this.registerUser.bind(this)}>Register</Button>
                    </Form>
                </Row>
            </Container>
        );
    };
}

export default Register; 

