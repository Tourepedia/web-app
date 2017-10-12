import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { Grid, Button } from "components"
import { logout } from "./store/user"


const AuthButton_ = withRouter(({ history, user, logout }) => (
  user.status === "authenticated" ? (
    <p><Button onClick={() => {
        logout().then(() => history.push('/'))
      }}>Sign out</Button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

const AuthButton = connect(
  state => ({ user: state.user }),
  dispatch => ({ logout: (...args) => dispatch(logout(...args))})
  )(AuthButton_)


export const Profile = ({ user }) => <Grid>
  <h2>Hi {user.data.name}</h2>
  <p>{user.data.email}</p>
  <hr/>
  <AuthButton />
</Grid>

export default connect((state) => ({ user: state.user }))(Profile)
