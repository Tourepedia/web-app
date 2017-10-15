import React from "react"

import { Route, Switch } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import {
  Grid,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from "components"

import Dashboard from "./Dashboard"
import Hotels from "./Hotels/"
import Users from "./Users/"
import Roles from "./Roles/"

export const Admin = () => {
  return (
    <Grid fluid>
      <Row>
        <Col xs={2}>
          <ListGroup>
            <ListGroupItem>Menu</ListGroupItem>
            <LinkContainer to="/a" exact>
              <ListGroupItem>Dashboard</ListGroupItem>
            </LinkContainer>
            <LinkContainer to="/a/hotels">
              <ListGroupItem>Hotels</ListGroupItem>
            </LinkContainer>
          </ListGroup>
          <ListGroup>
            <ListGroupItem>Admin</ListGroupItem>
            <LinkContainer to="/a/users">
              <ListGroupItem>Users</ListGroupItem>
            </LinkContainer>
            <LinkContainer to="/a/roles">
              <ListGroupItem>Roles</ListGroupItem>
            </LinkContainer>
          </ListGroup>
        </Col>
        <Col xs={10}>
          <Switch>
            <Route path="/a" exact component={Dashboard} />
            <Route path="/a/hotels" component={Hotels} />
            <Route path="/a/users" component={Users} />
            <Route path="/a/roles" component={Roles} />
          </Switch>
        </Col>
      </Row>
    </Grid>
    )
}

export default Admin
