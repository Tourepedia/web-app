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
    const { roomsRequired, nights, adults, aweb = 0, cweb = 0, cwoeb = 0, tripStartDate } = this.props
    const { selectedHotel, selectedMealPlan, selectedRoomType, selectedNights } = this.state
    const { prices = [] } = (selectedHotel ? selectedHotel.value : {})
    let roomTypesItemsById = {}
    let mealPlansItemById = {}
    let pricesByIds = {}
    for (let i = 0; i < prices.length; i++) {
      const price = prices[i]
      pricesByIds[price.id] = price
      roomTypesItemsById = price.room_types.reduce((data, rt) => {
        if (!data[rt.id]) {
          data[rt.id] = rt
        }
        if (data[rt.id].forPrices) {
          if (data[rt.id].forPrices.indexOf(price.id) === -1) {
            data[rt.id].forPrices.push(price.id)
          }
        } else {
          data[rt.id].forPrices = [price.id]
        }
        return data
      }, roomTypesItemsById)
      mealPlansItemById = price.meal_plans.reduce((data, mp) => {
        if (!data[mp.id]) {
          data[mp.id] = mp
        }
        if (data[mp.id].forPrices) {
          if (data[mp.id].forPrices.indexOf(price.id) === -1) {
            data[mp.id].forPrices.push(price.id)
          }
        } else {
          data[mp.id].forPrices = [price.id]
        }
        return data
      }, mealPlansItemById)
    }
    this.price = 0
    let warnMessage = ""
    if (selectedHotel && selectedMealPlan && selectedRoomType && selectedNights) {
      // let's calculate the price
      // first, filter the prices with selectedMealPlan and selectedRoomType
      const selectedMealPlanValue = selectedMealPlan.value
      const selectedRoomTypeValue = selectedRoomType.value

      // get the price ids which are commong to selectedRoomTypeValue and selectedMealPlanValue
      const pricesIds = selectedMealPlanValue.forPrices
        .filter(id => selectedRoomTypeValue.forPrices.indexOf(id) === -1) // remove the ids which are also present in room types
        .concat(selectedRoomTypeValue.forPrices) // get the unique set of prices
        .filter(id => selectedMealPlanValue.forPrices.indexOf(id) !== -1 && selectedRoomTypeValue.forPrices.indexOf(id) !== -1)

      if (pricesIds.length) {
        // we have some prices
        // get the prices whichi fits to the selected group details
        let noExtraBedPrice
        let awebPrice
        let cwebPrice
        let cwoebPrice
        for (let i = 0; i < pricesIds.length; i++) {
          const price = pricesByIds[pricesIds[i]]
          const adults_with_extra_bed = parseInt(price.adults_with_extra_bed, 10)
          const children_without_extra_bed = parseInt(price.children_without_extra_bed, 10)
          const children_with_extra_bed = parseInt(price.children_with_extra_bed, 10)
          if (adults_with_extra_bed === 0
            && children_without_extra_bed === 0
            && children_with_extra_bed === 0) {
            noExtraBedPrice = price
          } else if (adults_with_extra_bed) {
            awebPrice = price
          } else if (children_with_extra_bed) {
            cwebPrice = price
          } else if (children_without_extra_bed) {
            cwoebPrice = price
          }
        }

        // get the base price
        if (noExtraBedPrice) {
          this.price = noExtraBedPrice ? roomsRequired * parseInt(noExtraBedPrice.prices[0].value, 10) : 0
        } else {
          warnMessage += "Simple prices not set. "
        }
        // now get the extra or extra bed prices
        if (aweb) {
          if (awebPrice) {
            this.price += (awebPrice ? aweb * parseInt(awebPrice.prices[0].value, 10) : 0)
          } else {
            warnMessage += "Adults with extra bed price not set. "
          }
        }
        if (cweb) {
          if (cwebPrice) {
            this.price += (cwebPrice ? cweb * parseInt(cwebPrice.prices[0].value, 10) : 0)
          } else {
            warnMessage += "Children with extra bed price not set. "
          }
        }
        if (cwoeb) {
          if (cwoebPrice) {
            this.price += (cwoebPrice ? cwoeb * parseInt(cwoebPrice.prices[0].value, 10) : 0)
          } else {
            warnMessage += "Chilren without extra bed price not set. "
          }
        }

        // now multiply with number of nights
        this.price *= selectedNights.length
      }
    }
    return <tr>
      <td><Select multi options={makeArrayOfLength(nights, 1).map(d => ({ label: d, value: d }))} onChange={this.handleNightsSelectChange} value={selectedNights} /></td>
      <td><HotelsSelect multi={false} onChange={this.handleHotelSelectChange} value={selectedHotel} tripStartDate={tripStartDate} /></td>
      <td><Select placeholder="Select..." options={Object.keys(roomTypesItemsById).map(rtId => {
        const rt = roomTypesItemsById[rtId]
        return { label: rt.name, value: rt, title: rt.description }
      })} onChange={this.handleRoomTypeSelectChange} value={selectedRoomType} /></td>
      <td><Select placeholder="Select..." options={Object.keys(mealPlansItemById).map(mpId => {
        const mp = mealPlansItemById[mpId]
        return { label: mp.name, value: mp, title: mp.description }
      })} onChange={this.handleMealPlanSelectChange} value={selectedMealPlan}/></td>
      <td>{adults}</td>
      <td>{aweb}</td>
      <td>{cweb}</td>
      <td>{cwoeb}</td>
      <td>{this.price} {warnMessage ? <Button bsStyle="warning" bsSize="sm" className="pull-right" title={warnMessage}>
        <Glyphicon glyph="info-sign" />
        </Button> : null}
      </td>
      <td><Button onClick={this.handleRemove} bsStyle="danger" bsSize="sm" title="Remove Row">
        <Glyphicon glyph="trash" />
        </Button>
      </td>
    </tr>
  }
}

export class Prices extends Component {
  state = {
    baseInfoFilled: false,
    prices: { [tpuid()]: { price: 0 }}
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
            {this.inputGroupAdultsRef.value} Adults,{" "}
            {this.inputGroupAdultsWEBRef.value} Adults WEB,{" "}
            {this.inputGroupChildWEBRef.value} Child WEB,{" "}
            {this.inputGroupChildWoEBRef.value} Child WoEB
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
                inputProps={{ required:  true, name: "start_date", autoFocus: true }}
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
            <Row>
              <Col sm={3}>
                <FormGroup controlId="priceCalculation_adults">
                  <ControlLabel>Adults *</ControlLabel>
                    <FormControl
                      type="number"
                      name="adults"
                      placeholder="3"
                      defaultValue="1"
                      required
                      inputRef={ref => { this.inputGroupAdultsRef = ref }}
                     />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup controlId="priceCalculation_adults_web">
                  <ControlLabel title="Adults with extra bed">Adults WEB</ControlLabel>
                    <FormControl
                      type="number"
                      name="adults_web"
                      placeholder="3"
                      defaultValue="0"
                      inputRef={ref => { this.inputGroupAdultsWEBRef = ref }}
                     />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup controlId="priceCalculation_child_web">
                  <ControlLabel title="Child with extra bed">Child WEB</ControlLabel>
                    <FormControl
                      type="number"
                      name="child_web"
                      placeholder="3"
                      defaultValue="0"
                      inputRef={ref => { this.inputGroupChildWEBRef = ref }}
                     />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup controlId="priceCalculation_child_woeb">
                  <ControlLabel title="Child without extra bed">Child WoEB</ControlLabel>
                    <FormControl
                      type="number"
                      name="child_woeb"
                      placeholder="3"
                      defaultValue="0"
                      inputRef={ref => { this.inputGroupChildWoEBRef = ref }}
                     />
                </FormGroup>
              </Col>
            </Row>
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
              <th width="5%">Adults</th>
              <th width="5%" title="Adults with extra bed">AWEB</th>
              <th width="5%" title="Child with extra bed">CWEB</th>
              <th width="5%" title="Child without extra bed">CWoEB</th>
              <th width="10%">Price (INR)</th>
              <th width="4%"></th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(prices).map(id => (
              <PriceItem
                key={id}
                id={id}
                tripStartDate={this.inputStartDateRef.value.utc().format("YYYY-MM-DD HH:mm:ss")}
                onRemove={this.handleRemovePrice}
                onChange={this.handlePriceChange}
                roomsRequired={this.inputRoomsRequiredRef.value}
                nights={parseInt(this.inputNoOfNightsRef.value, 10)}
                adults={parseInt(this.inputGroupAdultsRef.value, 10)}
                aweb={parseInt(this.inputGroupAdultsWEBRef.value || 0, 10)}
                cweb={parseInt(this.inputGroupChildWEBRef.value || 0, 10)}
                cwoeb={parseInt(this.inputGroupChildWoEBRef.value || 0, 10)}
                />
              ))}
          </tbody>
          <tfoot>
              <tr>
                <th><Button bsStyle="info" onClick={this.handleAddMorePrices} block>Add More Prices</Button></th>
                <th colSpan="7" className="text-right">Total Price (INR)</th>
                <th>{Object.keys(prices).reduce((price, pId) => price + prices[pId].price, 0)}</th>
              </tr>
          </tfoot>
        </Table>
      </div>}
    </Panel>
  }
}

export default Prices
