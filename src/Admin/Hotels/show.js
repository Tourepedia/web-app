import React, { Component } from "react"
import { Route, Link, Switch, NavLink } from "react-router-dom"
import { connect } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { fetchItem, addContact } from "./store"

import * as listModel from "listModel"

import { Panel, Table, Alert, Button, Form, FormGroup, Col, FormControl, ControlLabel, HelpBlock, InputGroup } from "components"

export class NewContact_ extends Component {
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


export const NewContact = connect(mapStateToProps_, mapDispatchToProps_)(NewContact_)


export const Contacts_ = ({ contacts, match }) => {
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

const mapStateToProps__ = (state, ownProps) => {
  const { match: { params } } = ownProps
  const hotelId = parseInt(params.hotelId, 10)
  const hotel = listModel.getItem(state.hotels, hotelId)
  return {
    contacts: hotel.contacts
  }
}

export const Contacts = connect(mapStateToProps__)(Contacts_)

export class ShowItem extends Component {
  constructor (...args) {
    super(...args)
    const { fetch } = this.props
    fetch().catch(_ => {})
  }

  render () {
    const { item, match } = this.props
    if (!item) {
      return null
    }

    const meta = listModel.getItemMeta(item)
    if (meta.isFetching) {
      return <h1 className="text-center">Loading...</h1>
    }

    if (!item.name) {
      let message = "Something went wrong. Please try after some time. You know it happens.!!"
      if (meta.errors) {
        message = meta.errors.message
      }
      return <Alert bsStyle="danger">
          <h4>Oh snap! You got an error!</h4>
          <p>{message}</p>
          <p>
            <LinkContainer to="/a/hotels">
              <Button bsStyle="info">See List of Hotels</Button>
            </LinkContainer>
          </p>
        </Alert>
    }
    return (<Panel bsStyle="primary" header={
      <div>
        <h1>{item.name}</h1>
        {item.locations.map(l => l.short_name).join(", ")}
      </div>
    }>
      <section id="hotel-room-types">
        <h4>
          <Link to={`${match.url}#hotel-room-types`}>#</Link>
          <span> Room Types</span>
        </h4>
        <p>
          {item.room_types && item.room_types.length
            ? item.room_types.map(rt => <span key={rt.id}>
            <span className="label label-primary" title={rt.description}>{rt.name}</span> </span>)
            : <span className="text-muted">Not Set</span>
          }
        </p>
      </section>
      <hr/>
      <section id="hotel-meal-plans">
        <h4>
          <Link to={`${match.url}#hotel-meal-plans`}>#</Link>
          <span> Meal Plans</span>
        </h4>
        <p>
          {item.meal_plans && item.meal_plans.length
            ? item.meal_plans.map(mp => <span key={mp.id}>
            <span className="label label-primary" title={mp.description}>{mp.name}</span> </span>)
            : <span className="text-muted">Not Set</span>
          }
        </p>
      </section>
      <hr />
      <section id="hotel-contacts">
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
          <Route path={`${match.path}`} component={Contacts} />
        </Switch>
      </section>
    </Panel>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.hotels
  const { match: { params } } = ownProps
  const id = parseInt(params.hotelId, 10)
  const item = listModel.getItem(items, id)
  return {
    item,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const id = parseInt(params.hotelId, 10)
  return {
    fetch : _ => dispatch(fetchItem(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowItem)
