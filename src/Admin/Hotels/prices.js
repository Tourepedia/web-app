import React, { Component } from "react"

import { Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col, Row, Button, Table, Glyphicon } from "components"

import { LinkContainer } from "react-router-bootstrap"

import DatePicker from "components/DateTime"

import {default as Sel, withAutoSelect} from "components/Select/"
import HotelsSelect from "./priceHotelsSelect"

import tpuid from "tpuid"

const Select = withAutoSelect(Sel)

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

const makeArrayOfLength = (length, startFrom = 0) => {
  const _ = []
  length = length + startFrom
  for (let i = startFrom; i < length; i++) {
    _.push(i)
  }
  return _
}

export class PriceItem extends Component {
  constructor (...args) {
    super(...args)

    this.state = {
      selectedHotel: undefined,
      selectedRoomType: undefined,
      selectedMealPlan: undefined
    }

    this.price = 0
    this.lastPrice = 0
  }

  handleRemove = () => {
    const { id, onRemove } = this.props
    onRemove(id)
  }

  handleHotelSelectChange = selectedOption => {
    this.setState({
      selectedHotel: selectedOption,
      selectedRoomType: undefined,
      selectedMealPlan: undefined
    })
  }


  handleRoomTypeSelectChange = (selectedOption) => {
    this.setState({
      selectedRoomType: selectedOption
    })
  }

  handleMealPlanSelectChange = (selectedOption) => {
    this.setState({
      selectedMealPlan: selectedOption
    })
  }

  handleNightsSelectChange = (selectedOptions) => {
    this.setState({
      selectedNights: selectedOptions
    })
  }

  componentDidUpdate = () => {
    if (this.price !== this.lastPrice) {
      const { id, onChange } = this.props
      onChange(id, this.price)
    }
    this.lastPrice = this.price
  }

  render () {
    const { roomsRequired, nights, group, tripStartDate } = this.props
    const { selectedHotel, selectedMealPlan, selectedRoomType, selectedNights } = this.state
    const { prices = [], room_types = [], meal_plans = [] } = (selectedHotel ? selectedHotel.value : {})
    this.price = 0
    let warnMessage = ""
    if (selectedHotel && selectedMealPlan && selectedRoomType && selectedNights) {
      // let's calculate the price
      // first, filter the prices with selectedMealPlan and selectedRoomType
      const selectedMealPlanValue = selectedMealPlan.value
      const selectedRoomTypeValue = selectedRoomType.value

      // filter the prices for room type and meal plan
      const newPrices = prices.filter(price => price.room_type_id === selectedRoomTypeValue &&
        price.meal_plan_id === selectedMealPlanValue)


      // if we have some prices
      if (newPrices.length) {
        // get the prices which fits to the selected group details
        const { eb_child_age_start, eb_child_age_end } = selectedHotel

        // now multiply with number of nights
        this.price *= selectedNights.length
      }
    }
    return <tbody>
      <tr>
        <td>
          <Select
            multi
            options={makeArrayOfLength(nights, 1).map(d => ({ label: d, value: d }))}
            onChange={this.handleNightsSelectChange}
            value={selectedNights} />
        </td>
        <td>
          <HotelsSelect
            multi={false}
            onChange={this.handleHotelSelectChange}
            value={selectedHotel}
            tripStartDate={tripStartDate} />
        </td>
        <td>
          <Select
            placeholder="Select..."
            options={room_types.map(rt => {
              return { label: rt.name, value: rt, title: rt.description }
            })}
            onChange={this.handleRoomTypeSelectChange}
            value={selectedRoomType} />
          </td>
        <td>
          <Select
            placeholder="Select..."
            options={meal_plans.map(mp => {
              return { label: mp.name, value: mp, title: mp.description }
            })}
            onChange={this.handleMealPlanSelectChange}
            value={selectedMealPlan}/>
        </td>
        <td>
          {this.price} {warnMessage ? <Button bsStyle="warning" bsSize="sm" className="pull-right" title={warnMessage}>
            <Glyphicon glyph="info-sign" />
          </Button> : null}
        </td>
        <td>
          <Button onClick={this.handleRemove} bsStyle="danger" bsSize="sm" title="Remove Row">
            <Glyphicon glyph="trash" />
          </Button>
        </td>
      </tr>
      <tr>
        <td colSpan={6}>
          "Show the fit for the group"
        </td>
      </tr>
    </tbody>

  }
}

export class Prices extends Component {
  state = {
    baseInfoFilled: false,
    prices: { [tpuid()]: { price: 0 }},
    groupDetails: "",
  }

  handleGroupDetailsChange = (e) => {
    const details = e.target.value
    const regex = /^(\d+)\s*((adults|adult|children| child))\s*\(?\s*(\d+)?\s*(yr|yrs|year|years)?\)?$/i
    this.groupDetails = details.split(",").map(item => {
      // remove the space
      item = item.trim()
      const match = regex.exec(item)
      if (match) {
        // we have a match
        const count = match[1]
        const type = match[2]
        const age = match[4]

        return {
          type,
          count,
          age
        }
      }
      return undefined
    }).filter(item => item)
    this.setState({
      groupDetails: details
    })
  }

  handleBaseDetailsSubmit = e => {
    e.preventDefault()
    this.setState({
      baseInfoFilled: true
    })
  }

  handleEditBaseDetails = e => {
    this.setState({
      baseInfoFilled: false,
      prices: { [tpuid()]: { price: 0 }}
    })
  }

  handleAddMorePrices = (e) => {
    this.setState(prevState => ({
      prices: {...prevState.prices, [tpuid()] : { price: 0 }}
    }))
  }

  handleRemovePrice = (id) => {
    this.setState(prevState => {
      const { prices } = prevState
      delete prices[id]
      return {
        prices
      }
    })
  }

  handlePriceChange = (id, price) => {
    this.setState(prevState => ({
      prices: {
        ...prevState.prices,
        [id]: {
          ...prevState.prices[id],
          price
        }
      }
    }))
  }

  render () {
    const { baseInfoFilled, prices } = this.state
    let header = <h2>Price Calculation</h2>
    if (baseInfoFilled) {
      header = <div>
        <Button bsStyle="warning" bsSize="sm" className="pull-right" onClick={this.handleEditBaseDetails}>
          Edit Basic Details
        </Button>
        <p>Price Calculation</p>
        <hr />
        <Row>
          <Col sm={2}>
            <p>Start Date</p>
            {this.inputStartDateRef.value.format("DD MMM, YYYY")}
          </Col>
          <Col sm={2}>
            <p>Nights</p>
            {this.inputNoOfNightsRef.value}
          </Col>
          <Col sm={6}>
            <p>Group Details</p>
            {this.groupDetails && this.groupDetails.map(item =>
                `${item.count}: ${item.age ? (item.age + " yr old ") : ""}${item.type}`).join(", ")}
          </Col>
          <Col sm={2}>
            <p>Rooms Required</p>
            {this.inputRoomsRequiredRef.value}
          </Col>
        </Row>
      </div>
    }
    return <Panel bsStyle="primary" header={header}>
      <Form style={{ display: baseInfoFilled ? "none" : "block" }} onSubmit={this.handleBaseDetailsSubmit}>
        <Row>
          <Col sm={6}>
            <FormGroup controlId="priceCalculation_start_date">
              <ControlLabel>Start Date *</ControlLabel>
              <DatePicker
                name="start_date"
                autoFocus
                required
                startDate={TODAY}
                inputTZ="local"
                defaultValue={TODAY}
                viewMode="months"
                inputRef={ref => { this.inputStartDateRef = ref }}
                />
              <HelpBlock>Choose the start date of journey.</HelpBlock>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup controlId="priceCalculation_no_of_days_nights">
              <ControlLabel>No. of Nights *</ControlLabel>
              <FormControl
                type="number"
                name="no_of_nights"
                placeholder="6"
                defaultValue="1"
                min="1"
                required
                inputRef={ref => { this.inputNoOfNightsRef = ref }}
               />
              <HelpBlock>Number of nights for trips. Generally nights are 1 plus of days.</HelpBlock>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup controlId="group">
              <ControlLabel>Group Details</ControlLabel>
              <FormControl
                type="text"
                name="group_details"
                placeholder="4 Adults, 1 Child (10), 3 Children (5)"
                value={this.state.groupDetails}
                required
                onChange={this.handleGroupDetailsChange}
                />
              <HelpBlock>Please follow the format: <b>N Adults, M Child (age), P Child (age)</b>.</HelpBlock>
              <HelpBlock>{this.groupDetails && this.groupDetails.map(item =>
                `${item.count}: ${item.age ? (item.age + " yr old ") : ""}${item.type}`).join(", ")}</HelpBlock>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup controlId="priceCalculation_rooms_required">
              <ControlLabel>Rooms Required *</ControlLabel>
              <FormControl
                type="number"
                name="rooms_required"
                placeholder="3"
                defaultValue="1"
                min="1"
                required
                inputRef={ref => { this.inputRoomsRequiredRef = ref }}
               />
              <HelpBlock>Enter the number of room required.</HelpBlock>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Button type="submit" bsStyle="primary">Submit</Button>
          {" "}
          <LinkContainer to="/a/hotels">
            <Button>Cancel</Button>
          </LinkContainer>
        </FormGroup>
        <hr/>
      </Form>
      {baseInfoFilled && <div>
        <Table condensed hover bordered striped style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th width="20%">Night(s)</th>
              <th>Hotel</th>
              <th width="15%">Room Type</th>
              <th width="10%">Meal Plan</th>
              <th width="10%">Price (INR)</th>
              <th width="4%"></th>
            </tr>
          </thead>
          {Object.keys(prices).map(id => (
            <PriceItem
              key={id}
              id={id}
              tripStartDate={this.inputStartDateRef.value.utc().format("YYYY-MM-DD HH:mm:ss")}
              onRemove={this.handleRemovePrice}
              onChange={this.handlePriceChange}
              roomsRequired={this.inputRoomsRequiredRef.value}
              nights={parseInt(this.inputNoOfNightsRef.value, 10)}
              group={this.groupDetails}
              />
            ))}
          <tfoot>
              <tr>
                <th><Button bsStyle="info" onClick={this.handleAddMorePrices} block>Add More Prices</Button></th>
                <th colSpan="4" className="text-right">Total Price (INR)</th>
                <th>{Object.keys(prices).reduce((price, pId) => price + prices[pId].price, 0)}</th>
              </tr>
          </tfoot>
        </Table>
      </div>}
    </Panel>
  }
}

export default Prices
