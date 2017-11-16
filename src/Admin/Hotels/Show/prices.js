import React from "react"

import { Switch, Route, Link, NavLink } from "react-router-dom"

import { connect } from "react-redux"

import { LinkContainer } from "react-router-bootstrap"

import { Table, Button } from "components"

import DatePicker from "components/DateTime"

import * as listModel from "listModel"

import NewPrice from "./newPrice"

export const List = ({ prices, match }) => {
  if (!prices.length) {
    return <div className="text-center">
      <p>No Prices Set</p>
      <LinkContainer to={`${match.url}/add-price`}>
        <Button>Add Price</Button>
      </LinkContainer>
    </div>
  }
  return <Table hover condensed bordered style={{ tableLayout: "fixed" }}>
    <thead>
      <tr>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Location</th>
        <th>Room Type</th>
        <th>Meal Plan</th>
        <th title="Base Price">Base</th>
        <th title="Adult with extra bed price">Adult WEB</th>
        <th title="Child with extra bed price">Child WEB</th>
        <th title="Child without extra bed price">Child WoEB</th>
      </tr>
    </thead>
    <tbody>
      {prices.map((p, i) => (
        <tr key={p.id}>
          <td>
            <DatePicker readOnly dateFormat="DD MMM, YYYY" defaultValue={p.start_date} />
          </td>
          <td>
            <DatePicker readOnly dateFormat="DD MMM, YYYY" defaultValue={p.end_date} />
          </td>
          <td>{p.location.short_name}</td>
          <td>{p.room_type.name}</td>
          <td>{p.meal_plan.name}</td>
          <td>{p.base_price}</td>
          <td>{p.a_w_e_b}</td>
          <td>{p.c_w_e_b}</td>
          <td>{p.c_wo_e_b}</td>
        </tr>))}
    </tbody>
  </Table>
}

export const Prices = ({ match, item }) => {
  return (
    <section id="hotel-prices">
      <Switch>
        <Route path={`/a/hotels/${item.id}/add-price`}>
          <NavLink to={`/a/hotels/${item.id}`} className="pull-right">Cancel</NavLink>
        </Route>
        <Route path={`/a/hotels/${item.id}`}>
          <NavLink to={`/a/hotels/${item.id}/add-price`} className="pull-right">Add Price</NavLink>
        </Route>
      </Switch>
      <h4>
        <Link to={`${match.url}#hotel-prices`}>#</Link>
        <span> Prices</span>
      </h4>
      <Route path={`${match.path}/add-price`} component={NewPrice} />
      <Route path={`${match.path}`}>
        <List prices={item.prices} match={match} />
      </Route>
    </section>)
}


const mapStateToProps = (state, ownProps) => {
  const { match: { params } } = ownProps
  const hotelId = parseInt(params.hotelId, 10)
  const item = listModel.getItem(state.hotels, hotelId)
  return {
    item
  }
}


export default connect(mapStateToProps)(Prices)
