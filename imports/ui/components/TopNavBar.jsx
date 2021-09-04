import React from 'react'
import { Navbar, NavbarBrand, Container } from 'react-bootstrap'
import { Meteor } from 'meteor/meteor'
import { useHistory } from "react-router-dom"

export default function TopNavBar({ email }) {
    let history = useHistory()

    const signout = () => {
        Meteor.logout()
        history.push("/")
}

    return (
        <Navbar fixed="top" className="navbar-dark bg-dark">
            <Container>
                <NavbarBrand href="#home">Cloud Media</NavbarBrand>
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <u style={{cursor: "pointer", color: "rgb(82, 156, 195)"}}onClick={signout}>{email}</u>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
