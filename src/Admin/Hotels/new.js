import React, { Component } from "react"

import { connect } from "react-redux"

import { Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col, Button, Alert } from "components"
import LocationSelect from "components/Select/locations"
import MealPlansSelect from "./mealPlansSelect"
import RoomTypesSelect from "./roomTypesSelect"
import { createItem } from "./store"
import { LinkContainer } from "react-router-bootstrap"

import * as listModel from "listModel"

export class NewItem extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      name: "",
      e_b_child_age_start: 6,
      e_b_child_age_end: 12,
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

  handleEBChildStartAge = (e) => {
    this.setState({ e_b_child_age_start: e.target.value, dirty: { name: true } });
  }

  handleEBChildEndAge = (e) => {
    this.setState({ e_b_child_age_end: e.target.value, dirty: { name: true } });
  }

  handleCreateSubmit = (e) => {
    e.preventDefault()

    const { create } = this.props
    const name = this.inputNameRef.value.trim()
    const locations = this.inputLocationsRef.value.map(l => l.value)
    const mealPlans = this.inputMealPlansRef.value.map(l => l.value)
    const roomTypes = this.inputRoomTypesRef.value.map(l => l.value)
    const ebChildStartAgeRef = parseInt(this.inputEBChildStartAgeRef.value, 10)
    const ebChildEndAgeRef = parseInt(this.inputEBChildEndAgeRef.value, 10)

    const data = {
      name,
      locations,
      mealPlans,
      roomTypes,
      eb_child_age_start: ebChildStartAgeRef,
      eb_child_age_end: ebChildEndAgeRef
    }
    create(data)
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
                <LocationSelect ref={ref => { this.inputLocationsRef = ref }} required />
                <HelpBlock>Select atleast one location associated with hotel.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotel_meal-plans">
              <Col componentClass={ControlLabel} sm={2}>
                Meal Plans
              </Col>
              <Col sm={10}>
                <MealPlansSelect ref={ref => { this.inputMealPlansRef = ref }} />
                <HelpBlock>Select meal plans provided by the hotel.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotel_room-types">
              <Col componentClass={ControlLabel} sm={2}>
                Room Types
              </Col>
              <Col sm={10}>
                <RoomTypesSelect ref={ref => { this.inputRoomTypesRef = ref }} />
                <HelpBlock>Select room types provided by the hotel.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotel_e_b_child_start_age">
              <Col componentClass={ControlLabel} sm={2}>
                Extra bed child age
              </Col>
              <Col sm={4}>
                <FormControl
                  type="number"
                  value={this.state.e_b_child_age_start}
                  placeholder="6"
                  required
                  minLength="1"
                  inputRef={ref => { this.inputEBChildStartAgeRef = ref }}
                  onChange={this.handleEBChildStartAge}
                />
                <HelpBlock>Starting age of child (yrs).</HelpBlock>
              </Col>
              <Col sm={1} className="text-center">
                --
              </Col>
              <Col sm={4}>
                <FormControl
                  type="number"
                  value={this.state.e_b_child_age_end}
                  placeholder="7"
                  required
                  minLength={this.state.e_b_child_age_start}
                  inputRef={ref => { this.inputEBChildEndAgeRef = ref }}
                  onChange={this.handleEBChildEndAge}
                />
                <HelpBlock>Ending age of child (yrs).</HelpBlock>
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
