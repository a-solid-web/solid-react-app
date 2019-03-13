import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const Register = (props) => {
    return (
        <Container>
            <Row style={{marginTop: "5%"}}>
                <Form method="POST" action="https://solid.community/api/accounts/new">
                    <Form.Label>Enter username</Form.Label>
                    <Form.Control type="text" name="username"/>
                    <Form.Label>Enter password</Form.Label>
                    <Form.Control type="text" name="password"/>
                    <Form.Label>Enter name</Form.Label>
                    <Form.Control type="text" name="name"/>
                    <Form.Label>Enter email</Form.Label>
                    <Form.Control type="text" name="email"/>
                    <Button type="submit" style={{marginTop: "5%"}}>Register</Button>
                </Form>
            </Row>
        </Container>
    );
};

export default Register; 

