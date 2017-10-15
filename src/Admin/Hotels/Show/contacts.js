import React from "react"

import { LinkContainer } from "react-router-bootstrap"

import { Route, NavLink, Switch, Link } from "react-router-dom"

import * as listModel from "listModel"

import { connect } from "react-redux"

import { Button, Table } from "components"

import NewContact from "./newContact"

export const List = ({ contacts, match }) => {
  if (!contacts.length) {
    return <div className="text-center">
      <p>No Contact Attached</p>
      <LinkContainer to={`${match.url}/add-contact`}>
        <Button>Add Contact</Button>
      </LinkContainer>
    </div>
  }
  return <Table hover condensed bordered>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Phone Numner</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {contacts.map((c, i) => (
        <tr key={c.id}>
          <td>{i+1}</td>
          <td>{c.name}</td>
          <td>{c.phones.map(p => `${p.country_code}-${p.phone_number}`).join(", ")}</td>
          <td>{c.email}</td>
        </tr>))}
    </tbody>
  </Table>
}

export const Contacts = ({ match, item }) => {
  return (<section id="hotel-contacts">
    <Switch>
      <Route path={`/a/hotels/${item.id}/add-contact`}>
        <NavLink to={`/a/hotels/${item.id}`} className="pull-right">Cancel</NavLink>
      </Route>
      <Route path={`/a/hotels/${item.id}`}>
        <NavLink to={`/a/hotels/${item.id}/add-contact`} className="pull-right">Add Contact</NavLink>
      </Route>
    </Switch>
    <h4>
      <Link to={`${match.url}#hotel-contacts`}>#</Link>
      <span> Contacts</span>
    </h4>
    <Switch>
      <Route path={`${match.path}/add-contact`} component={NewContact} />
      <Route path={`${match.path}`}>
        <List contacts={item.contacts} match={match} />
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

export default connect(mapStateToProps)(Contacts)


