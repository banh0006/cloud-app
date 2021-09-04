import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useTracker } from 'meteor/react-meteor-data'
import Login from './pages/Login'
import Home from './pages/Home'
import {
    BrowserRouter as Router, 
    Redirect, 
    Route,
    Switch
} from 'react-router-dom'

export const App = () => {
  const user = useTracker(() => Meteor.user())

  // automatic redirect to login page if the user authenticated is missing
  const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
      <Route { ...rest } render = {
          props => user ?  <Component {...rest} {...props} /> :  <Redirect to="/" />
        } 
      />
    )
  }

  return (
  <Router>
    <div className="app">
      <Switch>
          <ProtectedRoute path='/home' component={Home} />
          <Route path='/' component={Login} />
      </Switch>
     
    </div>
  </Router>
)}
