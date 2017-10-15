import React, { Component } from "react"

import { connect } from "react-redux"

import { LinkContainer } from "react-router-bootstrap"

import { Button, Panel, Alert, Form, FormGroup, ControlLabel, FormControl, Row, Col, InputGroup } from "components"

import { DatePicker } from "components/DateTime"

import { default as Sel, withAutoSelect } from "components/Select/"

import * as listModel from "listModel"

import { addPrice } from "./../store"

const ALLOWED_EXTRA_BEDS = [0, 1, 2, 3, 4, 5].map(i => <option value={i} key={i}>{i}</option>)

const Select = withAutoSelect(Sel)

export class NewPrice extends Component {
  state = {
    created: false
  }
  constructor (...args) {
    super(...args)
    this.state = {
      startDate: undefined,
      endDate: undefined
    }
  }

  componentWillReceiveProps (nextProps) {
    const { hotel } = nextProps
    const meta = listModel.getItemMeta(hotel)
    const lastMeta = listModel.getItemMeta(this.props.hotel)
    if (!meta.isCreatingPrice && lastMeta.isCreatingPrice) {
      // price has been created
      this.setState({
        created: true
      })
    }
  }

  handleStartDateChange = (startDate) => {
    this.setState({
      startDate
    })
  }

  handleEndDateChange = (endDate) => {
    this.setState({
      endDate
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const locations = this.inputLocationsRef.value.map(i => i.value)
    const room_types = this.inputRoomTypesRef.value.map(i => i.value)
    const meal_plans = this.inputMealPlansRef.value.map(i => i.value)
    const adults_web = this.inputAdultsWEBRef.value
    const child_web = this.inputChildWEBRef.value
    const child_woeb = this.inputChildWoEBRef.value
    const start_date = this.inputStartDateRef.value.utc().format("YYYY-MM-DD HH:mm:ss")
    const end_date = this.inputEndDateRef.value.utc().format("YYYY-MM-DD HH:mm:ss")
    const price = this.inputPriceRef.value

    const { addPrice } = this.props

    addPrice({
      locations,
        room_types,
        meal_plans,
        adults_web,
        child_web,
        child_woeb,
        start_date,
        end_date,
        price
      });
  }

  handleCloseCreatedAlert = (e) => {
    e.preventDefault()
    this.setState({
      created: false
    })
  }

  render () {
    const { hotel, match } = this.props
    const { locations, meal_plans, room_types } = hotel
    const { startDate, endDate, created } = this.state
    return (created ? (
      <Alert onDismiss={this.handleCloseCreatedAlert}>
        <h4>Success!!</h4>
        <p>Price successfully created for Hotel.</p>
        <p>
          <LinkContainer to={match.url.split("/").slice(0, -1).join("/")}>
            <Button bsStyle="info" bsSize="sm" autoFocus>Done Creating</Button>
          </LinkContainer>
          {" "}
          <span> or </span>
          {" "}
          <Button bsSize="sm" onClick={this.handleCloseCreatedAlert}>Add More</Button>
        </p>
      </Alert>
      ) : (<Panel bsStyle="info">
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col sm={4}>
            <FormGroup controlId="newPrice_location">
              <ControlLabel>Location *</ControlLabel>
              <Select name="locations[]" multi required autoFocus options={locations.map(l =>
                ({ label: l.short_name, value: l.id, title: l.name }))} inputRef={ref => { this.inputLocationsRef = ref }} />
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="newPrice_room-type">
              <ControlLabel>Room Type *</ControlLabel>
              <Select name="room_types[]" multi required options={room_types.map(rt =>
                ({ label: rt.name, value: rt.id, title: rt.description }))} inputRef={ref => { this.inputRoomTypesRef = ref }} />
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="newPrice_meal-plan">
              <ControlLabel>Meal Plan *</ControlLabel>
              <Select name="meal_plans[]" multi required options={meal_plans.map(mp =>
                ({ label: mp.name, value: mp.id, title: mp.description }))} inputRef={ref => { this.inputMealPlansRef = ref }} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <FormGroup controlId="newPrice_adults-with-extra-bed">
              <ControlLabel>Adults with extra bed</ControlLabel>
              <FormControl componentClass="select" name="adults_web" inputRef={ref => { this.inputAdultsWEBRef = ref }}>
                {ALLOWED_EXTRA_BEDS}
              </FormControl>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="newPrice_child-with-extra-bed">
              <ControlLabel>Children with extra bed</ControlLabel>
              <FormControl componentClass="select" name="child_web" inputRef={ref => { this.inputChildWEBRef = ref }}>
                {ALLOWED_EXTRA_BEDS}
              </FormControl>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="newPrice_child-without-extra-bed">
              <ControlLabel>Children without extra bed</ControlLabel>
              <FormControl componentClass="select" name="child_woeb" inputRef={ref => { this.inputChildWoEBRef = ref }}>
                {ALLOWED_EXTRA_BEDS}
              </FormControl>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="newPrice_start-date">
              <ControlLabel>Start Date</ControlLabel>
              <DatePicker
                inputProps={{
                  name: "start_date",
                  required: true,
                }}
                endDate={endDate}
                onChange={this.handleStartDateChange}
                viewMode="months"
                inputRef={ref => { this.inputStartDateRef = ref }}
                />
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="newPrice_end-date">
              <ControlLabel>End Date</ControlLabel>
              <DatePicker
                inputProps={{
                  name: "end_date",
                  required: true,
                }}
                startDate={startDate}
                onChange={this.handleEndDateChange}
                viewMode="months"
                inputRef={ref => { this.inputEndDateRef = ref }}
                />
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="newPrice_price">
              <ControlLabel>Price</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>INR</InputGroup.Addon>
                <FormControl
                  type="number"
                  name="price"
                  placeholder="2000"
                  required
                  inputRef={ref => { this.inputPriceRef = ref }}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Button type="submit" bsStyle="primary">
            Submit
          </Button>
          {" "}
          <LinkContainer to={match.url.split("/").slice(0, -1).join("/")}>
            <Button>
              Cancel
            </Button>
          </LinkContainer>
        </FormGroup>
      </Form>
    </Panel>))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match: { params } } = ownProps
  const hotelId = parseInt(params.hotelId, 10)
  const hotel = listModel.getItem(state.hotels, hotelId)
  return {
    hotel
  }
}

const mapDispatchToProps_ = (dispatch, ownProps) => {
  const { match: { params } } = ownProps
  const id = parseInt(params.hotelId, 10)
  return {
    addPrice : (...args) => dispatch(addPrice(id, ...args))
  }
}


export default connect(mapStateToProps, mapDispatchToProps_)(NewPrice)
