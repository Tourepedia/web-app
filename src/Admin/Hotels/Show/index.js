import React, { Component } from "react"
import { Route, Link } from "react-router-dom"
import { connect } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { fetchItem } from "./../store"

import * as listModel from "listModel"

import { Panel , Alert, Button, Row, Col } from "components"

import Contacts from "./contacts"
import Prices from "./prices"


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
      <Row>
        <Col sm={6}>
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
        </Col>
        <Col sm={4}>
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
        </Col>
        <Col sm={2}>
          <section id="hotel-eb-child-age-interval">
            <h4>
              <Link to={`${match.url}#hotel-eb-child-age-interval`}>#</Link>
              <span> Extra Bed Child</span>
            </h4>
            <p>{item.eb_child_age_start} to {item.eb_child_age_end} yrs</p>
          </section>
        </Col>
      </Row>
      <hr />
      <Route path={`${match.path}`} component={Prices} />
      <hr />
      <Route path={`${match.path}`} component={Contacts} />
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
