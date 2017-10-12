import React from "react"

import { connect } from "react-redux"
import { Route, Redirect } from "react-router-dom"

const PrivateRoute_ = ({ component: Component, user, permission, ...rest }) => (
  <Route {...rest} render={props => (
    user.status === "authenticated" && user.info === "fetched" ? (
      <Component {...props}/>
    ) : user.status !== "authenticated" ? (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    ) : <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
  )}/>
)

export default connect(state => ({ user: state.user }))(PrivateRoute_)
