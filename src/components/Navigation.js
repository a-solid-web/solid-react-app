import React from "react";
import { NavLink } from "react-router-dom"; 
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";


const Navigation = () => {
    return(
        <div>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Navbar.Brand>SOLID</Navbar.Brand>
                <Nav className="mr-auto">
                    <NavLink to="/" style={{marginLeft: "20px"}}>Home</NavLink>
                    <NavLink to="/public/card" style={{marginLeft: "20px"}}>Publicprofile</NavLink>
                    <NavLink to="/register" style={{marginLeft: "20px"}}>Register</NavLink>
                    <NavLink to="/test" style={{marginLeft: "20px"}}>Test</NavLink>
                </Nav>
            </Navbar>
            <br/>
        </div>
    );
};

export default Navigation; 