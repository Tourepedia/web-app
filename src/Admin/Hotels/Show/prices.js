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
        <th>Location</th>
        <th>Room Type</th>
        <th>Meal Plan</th>
        <th>Adults WEB</th>
        <th>Child WEB</th>
        <th>Child WoEB</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Price (INR)</th>
      </tr>
    </thead>
    <tbody>
      {prices.map((p, i) => (
        <tr key={p.id}>
          <td>{p.locations.map(l => l.short_name).join(", ")}</td>
          <td>{p.room_types.map(rt => rt.name).join(", ")}</td>
          <td>{p.meal_plans.map(mp => mp.name).join(", ")}</td>
          <td>{p.adults_with_extra_bed}</td>
          <td>{p.children_with_extra_bed}</td>
          <td>{p.children_without_extra_bed}</td>
          <td>
            <DatePicker readOnly dateFormat="DD MMM, YYYY" defaultValue={p.dates.filter(d => d.role === "start_date")[0].value} />
          </td>
          <td>
            <DatePicker readOnly dateFormat="DD MMM, YYYY" defaultValue={p.dates.filter(d => d.role === "end_date")[0].value} />
          </td>
          <td>{p.prices.map(p => p.value).join(", ")}</td>
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
      <Switch>
        <Route path={`${match.path}/add-price`} component={NewPrice} />
        <Route path={`${match.path}`}>
          <List prices={item.prices} match={match} />
        </Route>
      </Switch>
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
