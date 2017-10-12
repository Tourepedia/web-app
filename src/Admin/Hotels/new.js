import React, { Component } from "react"

import { connect } from "react-redux"

import { Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col, Button, Alert } from "components"
import LocationSelect from "components/Select/locations"
import { createItem } from "./store"
import { LinkContainer } from "react-router-bootstrap"

import * as listModel from "listModel"

export class NewItem extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      name: "",
      dirty: {},
      created: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { meta } = nextProps
    if (!meta.isCreating && this.props.meta.isCreating) {
      this.setState({ created: true })
    }
  }

  getValidationState = () => {
    const length = this.state.name.length
    if (length >= 4 && length <= 100) return 'success'

    if (this.state.dirty.name) {
      return "error"
    }
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value, dirty: { name: true } });
  }

  handleCreateSubmit = (e) => {
    e.preventDefault()

    const { create } = this.props
    const name = this.inputNameRef.value.trim()
    const locations = this.inputLocationsRef.value.map(l => l.value)

    create({ name, locations })
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
            <p>Hotel successfull created.</p>
            <p>
              <LinkContainer to={`/a/hotels/${lastCreatedId}`}>
                <Button bsStyle="info" bsSize="sm" autoFocus>See Hotel</Button>
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
              controlId="newHotel_name"
              validationState={this.getValidationState()}>
              <Col componentClass={ControlLabel} sm={2}>
                Name *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  value={this.state.name}
                  placeholder="Taj Hotel"
                  required
                  maxLength="100"
                  minLength="4"
                  inputRef={ref => { this.inputNameRef = ref }}
                  autoFocus
                  onChange={this.handleNameChange}
                />
                <FormControl.Feedback />
                <HelpBlock>Hotel name should be unique with minimum 4 chars to maximum 100 chars.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotel_locations">
              <Col componentClass={ControlLabel} sm={2}>
                Location *
              </Col>
              <Col sm={10}>
                <LocationSelect ref={ref => { this.inputLocationsRef = ref }} />
                <HelpBlock>Select atleast one location associated with hotel.</HelpBlock>
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
                    <LinkContainer to="/a/hotels">
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
  const items = state.hotels
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
