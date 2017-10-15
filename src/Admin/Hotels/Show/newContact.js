import React, { Component } from "react"

import { connect } from "react-redux"

import * as listModel from "listModel"

import { LinkContainer } from "react-router-bootstrap"

import { Panel, Alert, Button, Form, FormGroup, FormControl, InputGroup, ControlLabel, HelpBlock, Col } from "components"

import { addContact } from "./../store"

export class NewContact extends Component {
  state = {
    created: false
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { addContact } = this.props
    addContact({
      name: this.inputNameRef.value.trim(),
      phone_number: this.inputPhoneNumberRef.value.trim(),
      email: this.inputEmailRef.value.trim()
    })
  }

  componentWillReceiveProps (nextProps) {
    const { hotel } = nextProps
    const meta = listModel.getItemMeta(hotel)
    const lastMeta = listModel.getItemMeta(this.props.hotel)
    if (!meta.isCreatingContact && lastMeta.isCreatingContact) {
      // contact has been created
      this.setState({
        created: true
      })
    }
  }

  handleCloseCreatedAlert = (e) => {
    e.preventDefault()
    this.setState({
      created: false
    })
  }

  render () {
    const { hotel } = this.props
    const meta = listModel.getItemMeta(hotel)
    const { created } = this.state
    return (created ? (
        <Alert onDismiss={this.handleCloseCreatedAlert}>
          <h4>Success!!</h4>
          <p>Contact successfully created for Hotel.</p>
          <p>
            <LinkContainer to={`/a/hotels/${hotel.id}`}>
              <Button bsStyle="info" bsSize="sm" autoFocus>Done Adding</Button>
            </LinkContainer>
            {" "}
            <span> or </span>
            {" "}
            <Button bsSize="sm" onClick={this.handleCloseCreatedAlert}>Add More</Button>
          </p>
        </Alert>
        ) : (<Panel bsStyle="info">
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormGroup
          controlId="newHotelContact_name">
          <Col componentClass={ControlLabel} sm={2}>
            Name *
          </Col>
          <Col sm={10}>
            <FormControl
              type="text"
              placeholder="John Mark"
              required
              maxLength="100"
              minLength="4"
              inputRef={ref => { this.inputNameRef = ref }}
              autoFocus
            />
            <FormControl.Feedback />
            <HelpBlock>Name of the contact must be from 4 to 100 chars.</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup
          controlId="newHotelContact_name">
          <Col componentClass={ControlLabel} sm={2}>
            Phone *
          </Col>
          <Col sm={10}>
            <InputGroup>
              <InputGroup.Addon>+91</InputGroup.Addon>
              <FormControl
                type="text"
                placeholder="9551212333"
                required
                maxLength="100"
                minLength="4"
                inputRef={ref => { this.inputPhoneNumberRef = ref }}
              />
            </InputGroup>
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup
          controlId="newHotelContact_name">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl
              type="email"
              placeholder="contact@example.com"
              maxLength="100"
              inputRef={ref => { this.inputEmailRef = ref }}
            />
          </Col>
        </FormGroup>
        {meta.isCreatingContact ? (
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="button" disabled>Adding...</Button>
            </Col>
          </FormGroup>
          ) : (
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button bsStyle="primary" type="submit">Submit</Button>
              {" "}
              <LinkContainer to={`/a/hotels/${hotel.id}`}>
                <Button bsStyle="default">Cancel</Button>
              </LinkContainer>
            </Col>
          </FormGroup>
          )}
      </Form>
    </Panel>))
  }
}

const mapStateToProps_ = (state, ownProps) => {
  const { match: { params } } = ownProps
  const hotelId = parseInt(params.hotelId, 10)
  const hotel = listModel.getItem(state.hotels, hotelId)
  return {
    hotel
  }
}

const mapDispatchToProps_ = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const hotelId = parseInt(params.hotelId, 10)
  return {
    addContact : (...args) => dispatch(addContact(hotelId, ...args))
  }
}


export default connect(mapStateToProps_, mapDispatchToProps_)(NewContact)

