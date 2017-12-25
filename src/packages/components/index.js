import React, { Children } from "react"
import {
    Grid,
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    Row,
    Col,
    Panel,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Checkbox,
    Radio,
    Jumbotron,
    Button,
    ListGroup,
    ListGroupItem,
    Breadcrumb as BBreadcrumb,
    HelpBlock,
    Table,
    Modal,
    Alert,
    InputGroup,
    Glyphicon,
    Media,
} from 'react-bootstrap'
import { LinkContainer } from "react-router-bootstrap"
import DotDotDot from "./DotDotDot/"
// BBreadcrumb.Item require an active as a props, but we get className="active" from LinkContainer, so wrap it to fake it
const BreadcrumbItem = ({ className, ...otherProps }) => <BBreadcrumb.Item active={className === "active"} {...otherProps} />

const Breadcrumb = ({ breadcrumb, children }) => (
  <BBreadcrumb>
    {breadcrumb.map((b, i) => {
      const { label, ...otherProps } = b
      if (!label) return null
      return <LinkContainer key={i} {...otherProps} exact>
        <BreadcrumbItem>
          {label}
        </BreadcrumbItem>
      </LinkContainer>
    })}
    {Children.only(children)}
  </BBreadcrumb>
)

export {
    Grid,
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    Row,
    Col,
    Panel,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Checkbox,
    Radio,
    Jumbotron,
    Button,
    ListGroup,
    ListGroupItem,
    Breadcrumb,
    HelpBlock,
    Table,
    Modal,
    Alert,
    InputGroup,
    Glyphicon,
    Media,
    DotDotDot
}

