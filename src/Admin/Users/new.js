import React, { Component } from "react"

import { connect } from "react-redux"

import { Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col, Button, Alert } from "components"
import { createItem } from "./store"
import { LinkContainer } from "react-router-bootstrap"

import * as listModel from "listModel"

export class NewItem extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      created: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { meta } = nextProps
    if (!meta.isCreating && this.props.meta.isCreating) {
      this.setState({ created: true })
    }
  }

  handleCreateSubmit = (e) => {
    e.preventDefault()

    const { create } = this.props
    const name = this.inputNameRef.value.trim()
    const email = this.inputEmailRef.value.trim()
    const password = this.inputPasswordRef.value
    const password_confirmation = this.inputConfirmPasswordRef.value

    create({ name, email, password, password_confirmation })
  }

  handleCloseCreatedAlert = (e) => {
    e.preventDefault()
    this.setState({
      created: false
    })
    // focus the input: Name
    if (this.inputNameRef) this.inputNameRef.focus()
  }

  render () {
    const { meta = {} } = this.props
    const { created } = this.state
    const { isCreating, lastCreatedId } = meta
    return (
      <div>
        {created ? (
          <Alert bsStyle="success" onDismiss={this.handleCloseCreatedAlert}>
            <h4>Success!!</h4>
            <p>User successfull created.</p>
            <p>
              <LinkContainer to={`/a/users/${lastCreatedId}`}>
                <Button bsStyle="info" bsSize="sm" autoFocus>See User</Button>
              </LinkContainer>
              {" "}
              <span> or </span>
              {" "}
              <Button bsSize="sm" onClick={this.handleCloseCreatedAlert}>Add More</Button>
            </p>
          </Alert>
          ) : (
        <Panel header={<div className="text-right">Fields marked with * are medantory.</div>}>
          <Form onSubmit={this.handleCreateSubmit} horizontal>
            <FormGroup
              controlId="newUser_name">
              <Col componentClass={ControlLabel} sm={2}>
                Name *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Max Clark"
                  maxLength="100"
                  minLength="4"
                  required
                  autoFocus
                  inputRef={ref => { this.inputNameRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>User name should be unique with minimum 4 chars to maximum 100 chars.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newUser_email">
              <Col componentClass={ControlLabel} sm={2}>
                Email *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="user@tourepedia.com"
                  maxLength="100"
                  required
                  inputRef={ref => { this.inputEmailRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Email should be unique for all registered users.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newUser_password">
              <Col componentClass={ControlLabel} sm={2}>
                Password *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="password"
                  name="password"
                  minLength="6"
                  required
                  inputRef={ref => { this.inputPasswordRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>
                  Password should be strong from minimum 6 chars, with at least one Capital letter, at least one special charactor.
                </HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newUser_repassword">
              <Col componentClass={ControlLabel} sm={2}>
                Re-Password *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="password"
                  name="password_confirmation"
                  minLength="6"
                  required
                  inputRef={ref => { this.inputConfirmPasswordRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>
                  Re-Type the password that you entered into password field.
                </HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup>
                {isCreating ? (
                  <Col smOffset={2} sm={10}>
                    <Button type="button" disabled>
                      Submitting...
                    </Button>
                  </Col>
                  ) : (
                  <Col smOffset={2} sm={10}>
                    <Button type="submit" bsStyle="primary">
                      Submit
                    </Button>
                    {" "}
                    <LinkContainer to="/a/users">
                      <Button>
                        Cancel
                      </Button>
                    </LinkContainer>
                  </Col>
                  )}
            </FormGroup>
          </Form>
        </Panel>)}
      </div>
      )
  }
}

const mapStateToProps = (state) => {
  const items = state.users
  const meta = listModel.getMeta(items)
  return {
    meta
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    create: (...args) => dispatch(createItem(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItem)
