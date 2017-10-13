import React from "react"
import { Switch, Route } from "react-router-dom"
import { connect } from "react-redux"
import { Grid, Row, Col, ListGroup, ListGroupItem, Button } from "components"
import { LinkContainer } from "react-router-bootstrap"
import { logout } from "./store/user"

export const Info_ = ({ user, history, logout }) => (
  <div>
    <h2>
      Hi {user.data.name}
      {" "}
      <small>
        {user.data.roles.map(role => <span className="label label-warning" key={role.name}>{role.name}</span>)}
      </small>
    </h2>
    <p>{user.data.email}</p>
    <hr />
    <Button onClick={() => {
      logout().then(() => history.push('/'))
    }}>Sign out</Button>
  </div>
  )

export const Info = connect(
  (state) => ({ user: state.user }),
  dispatch => ({ logout: (...args) => dispatch(logout(...args))})
  )(Info_)

export const Profile = ({ match }) => <Grid>
  <Row>
    <Col xs={3}>
      <ListGroup>
        <ListGroupItem>Personal Settings</ListGroupItem>
        <LinkContainer to={match.path} exact>
          <ListGroupItem>Profile</ListGroupItem>
        </LinkContainer>
      </ListGroup>
    </Col>
    <Col xs={9}>
      <Switch>
        <Route path={match.path} component={Info} />
      </Switch>
    </Col>
  </Row>
</Grid>

export default Profile
