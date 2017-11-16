import React, { Component } from "react"

import { connect } from "react-redux"

import { LinkContainer } from "react-router-bootstrap"

import { Button, Panel, Alert, Form, FormGroup, ControlLabel, FormControl, Row, Col, Table } from "components"

import { DateRangePickerList } from "components/DateTime"

import { default as Sel, withAutoSelect } from "components/Select/"

import * as listModel from "listModel"

import { addPrice } from "./../store"

import { getServerTimestamp } from "timestamp"

const Select = withAutoSelect(Sel)

const PRICE_TYPES = [{
  key: "base_price",
  value: "Base Price",
}, {
  key: "a_w_e_b",
  value: "Adult with exta bed",
}, {
  key: "c_w_e_b",
  value: "Child with extra bed",
}, {
  key: "c_wo_e_b",
  value: "Child without extra bed",
}]

export class NewPrice extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      created: false
    }
    this.mealPlansInputRef = {}
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


    const intervals = this.dateIntervalRef.value.map(interval => ({
      start_date: getServerTimestamp(interval.startDate),
      end_date: getServerTimestamp(interval.endDate)
    }))

    const locations = this.inputLocationsRef.value.map(i => i.value)
    const room_types = this.inputRoomTypesRef.value.map(i => i.value)
    const meal_plans = {}

    for (let mp in this.mealPlansInputRef) {
      if (this.mealPlansInputRef.hasOwnProperty(mp)) {
        if (!meal_plans[mp]) {
          meal_plans[mp] = {}
        }
        const prices = this.mealPlansInputRef[mp]
        for (let pt in prices) {
          if (prices.hasOwnProperty(pt)) {
            meal_plans[mp][pt] = prices[pt].value ? parseInt(prices[pt].value, 10) : 0
          }
        }
      }
    }

    const { addPrice } = this.props

    const data = {
      intervals,
      locations,
      room_types,
      meal_plans,
    }

    addPrice(data);
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
    const { created } = this.state
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
          <Col md={4}>
            <FormGroup controlId="newPrice_dates">
              <ControlLabel>Date interval(s) *</ControlLabel>
              <DateRangePickerList
                autoFocus
                dateFormat="DD MMM YYYY"
                required
                ref={ref => { this.dateIntervalRef = ref }} />
            </FormGroup>
          </Col>
          <Col md={8}>
            <Row>
              <Col sm={6}>
                <FormGroup controlId="newPrice_location">
                  <ControlLabel>Location *</ControlLabel>
                  <Select
                    name="locations[]"
                    multi
                    required
                    options={locations.map(l =>
                      ({ label: l.short_name, value: l.id, title: l.name }))}
                    defaultValue={locations.map(l =>
                      ({ label: l.short_name, value: l.id, title: l.name }))}
                    inputRef={ref => { this.inputLocationsRef = ref }} />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup controlId="newPrice_room-type">
                  <ControlLabel>Room Type *</ControlLabel>
                  <Select
                    name="room_types[]"
                    multi
                    options={room_types.map(rt =>
                      ({ label: rt.name, value: rt.id, title: rt.description }))}
                    inputRef={ref => { this.inputRoomTypesRef = ref }} />
                </FormGroup>
              </Col>
              <Col sm={12}>
                <Table bordered condensed>
                  <thead>
                    <tr>
                      <th className="text-muted text-center">INR</th>
                      {PRICE_TYPES.map(type => <th key={type.key}>{type.value}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {meal_plans.map(mp =>
                      (<tr key={mp.name}>
                        <th title={mp.description} className="text-right">{mp.name}</th>
                        {PRICE_TYPES.map(type => <td key={type.key} style={{ padding: 0 }}>
                          <FormGroup bsSize="sm">
                            <FormControl
                              type="number"
                              name={`${mp.name}_${type.key}_price`}
                              placeholder="2000"
                              min="1"
                              defaultValue="1000"
                              inputRef={ref => {
                                if (!this.mealPlansInputRef[mp.id]) {
                                  this.mealPlansInputRef[mp.id] = {}
                                }
                                this.mealPlansInputRef[mp.id][type.key] = ref
                              }}
                            />
                          </FormGroup>
                        </td>)}
                      </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
        <FormGroup>
          <Button type="submit" bsStyle="primary">
            Submit
          </Button>
          {" "}
          <LinkContainer to={match.url.split("/").slice(0, -1).join("/")} exact>
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
