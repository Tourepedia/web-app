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
    const description = this.inputDescriptionRef.value.trim()

    create({ name, description })
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
            <p>Role successfull created.</p>
            <p>
              <LinkContainer to={`/a/roles/${lastCreatedId}`}>
                <Button bsStyle="info" bsSize="sm" autoFocus>See Role</Button>
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
              controlId="newRole_name">
              <Col componentClass={ControlLabel} sm={2}>
                Name *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Sales Manager"
                  maxLength="100"
                  minLength="3"
                  required
                  autoFocus
                  inputRef={ref => { this.inputNameRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Role's name should be unique with minimum 4 chars to maximum 100 chars.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newRole_description">
              <Col componentClass={ControlLabel} sm={2}>
                Description
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  placeholder="This role hold the following responsibilities in the system..."
                  maxLength="1000"
                  inputRef={ref => { this.inputDescriptionRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Provide the description for the role.</HelpBlock>
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
                    <LinkContainer to="/a/roles">
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
  const items = state.roles
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
