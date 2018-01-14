import React from "react"

import { Link } from "react-router-dom"

import {
  Navbar,
  Nav,
  NavItem,
  Glyphicon,
  NavDropdown,
  MenuItem,
} from "components"

import { LinkContainer } from "react-router-bootstrap"
import { withPermission } from "components/ConnectedPermission"
import { ConnectedAuth } from "components/ConnectedAuth"

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
          <NavItem><Glyphicon glyph="home" />&nbsp;&nbsp;Home</NavItem>
        </LinkContainer>
        <LinkContainer eventKey={2} to="/about">
          <NavItem><Glyphicon glyph="info-sign" />&nbsp;&nbsp;About Us</NavItem>
        </LinkContainer>
        <ConnectedAuth render={({ isAuthenticated, user, ...otherProps }) => !isAuthenticated
          ? <LinkContainer eventKey={3} to="/profile" {...otherProps}>
          <NavItem><Glyphicon glyph="user" />&nbsp;&nbsp;Login</NavItem>
        </LinkContainer> : <NavDropdown eventKey={3} title={<span>
          Hi {user.name.split(/\s/)[0]}
        </span>} id="userInfoDropdown" {...otherProps}>
          <LinkContainer eventKey={3.1} to="/profile">
            <MenuItem><Glyphicon glyph="user" />&nbsp;&nbsp;Profile</MenuItem>
          </LinkContainer>
          <MenuItem divider />
          <LinkContainer eventKey={3.2} to="/logout">
            <MenuItem><Glyphicon glyph="off" />&nbsp;&nbsp;Logout</MenuItem>
          </LinkContainer>
        </NavDropdown>} />
        <WithCanSeePermission eventKey={4} to="/a">
          <NavItem><Glyphicon glyph="text-background" />&nbsp;&nbsp;Admin</NavItem>
        </WithCanSeePermission>
      </Nav>
    </Navbar.Collapse>
</Navbar>)

export default header
