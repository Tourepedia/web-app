import React from "react"

import { Link } from "react-router-dom"

import {
  Navbar,
  Nav,
  NavItem
} from "components"

import { LinkContainer } from "react-router-bootstrap"
import withPermission from "components/WithPermission"

const WithCanSeePermission = withPermission((props) => <LinkContainer {...props} />, "can_see_admin_dashboard")


export const header = () => (
  <Navbar fixedTop fluid inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">{ process.env.REACT_APP_APPLICATION_NAME }</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <LinkContainer eventKey={1} to="/" exact>
          <NavItem>Home</NavItem>
        </LinkContainer>
        <LinkContainer eventKey={2} to="/about">
          <NavItem>About Us</NavItem>
        </LinkContainer>
        <LinkContainer eventKey={3} to="/profile">
          <NavItem>User</NavItem>
        </LinkContainer>
        <WithCanSeePermission eventKey={4} to="/a">
          <NavItem>Admin</NavItem>
        </WithCanSeePermission>
      </Nav>
    </Navbar.Collapse>
</Navbar>)

export default header
