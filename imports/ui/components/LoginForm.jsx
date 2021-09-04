import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { useHistory } from "react-router-dom"
import {
    Form,
    Row,
    FormLabel,
    FormControl,
    Button,
    Col
} from 'react-bootstrap'

export default function LoginForm() {
    const [userEmail, setUserEmail] = useState('')
    const [userPass, setUserPass] = useState('')
    const [isLoggingIn, setIsLoggingIn] = useState(true)

    let history = useHistory()

    const submit = e => {
        e.preventDefault()

        if (isLoggingIn) {
            Meteor.loginWithPassword(userEmail, userPass, (error) => {
                if (error) {
                    alert(error.reason)
                } else {
                    history.push("/home")
                }
            })
        } else {
            const user = {
                email: userEmail,
                password: userPass
            }

            Accounts.createUser(user, (error) => {
                if (error) {
                    alert(error.reason)
                } else {
                    alert("Your account have been successfully created! Please login to use the app.")
                    setIsLoggingIn(true)
                }
            })
        }
    }

    const createAccountClick = e => {
        e.preventDefault()

        if (isLoggingIn) {
            setUserEmail('')
            setUserPass('')
            setIsLoggingIn(false)
        } else {
            setIsLoggingIn(true)
        }
    }

    return (
        <Form onSubmit={submit} className="login-form">
            <Row>
                <h2>{isLoggingIn ? "Sign in" : "Sign up"}</h2>
            </Row>
            <Row>
                <Col xs={3} className="text-right mb-4">
                    <FormLabel htmlFor="email">Email</FormLabel>
                </Col>
                <Col xs={9}>
                    <FormControl
                        type="email"
                        placeholder="example@gmail.com"
                        name="email"
                        value={userEmail}
                        required
                        onChange={e => setUserEmail(e.target.value)}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={3} className="text-right mb-4">
                    <FormLabel htmlFor="password">Password</FormLabel>
                </Col>
                <Col xs={9}>
                    <FormControl
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={userPass}
                        autoComplete="on"
                        required
                        onChange={e => setUserPass(e.target.value)}
                    />
                </Col>
            </Row>
            <Row><Button type="submit" variant="primary">{ isLoggingIn ? "Log In" : "Sign up" }</Button></Row>
            <Row>
                <Button variant="success" className="my-3" onClick={createAccountClick}>
                    { isLoggingIn ? "Create new account" : "Cancel" }
                </Button>
            </Row>
        </Form>
    )
}
