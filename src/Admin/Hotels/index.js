import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Route, Switch, withRouter, matchPath, NavLink } from "react-router-dom"
import { injectReducer } from "reducers"
import {default as reducer} from "./store"
import {
  Breadcrumb
} from "components"

import * as listModel from "listModel"
import List from "./list"
import Show from "./show"
import New from "./new"
import RoomTypes from "./RoomTypes"
import MealPlans from "./MealPlans"

export class View extends Component {
  // we need store from context type for adding reducer
  static contextTypes = {
    store: PropTypes.object
  }


  constructor (...args) {
    super(...args)
    injectReducer(this.context.store, { key: "hotels", reducer })
    this.previousLocation = this.props.location
  }

  // componentWillUpdate (nextProps) {
  //   const { location } = this.props

  //   // update the previous location if state is not set to show modal
  //   if (nextProps.history.action !== "POP" && (!location.state || !location.state.modal)) {
  //     this.previousLocation = this.props.location
  //   }
  // }

  render () {
    const {
      items,
      location,
      match,
    } = this.props
    // if no items, means that reducer is not attached yet
    if (!items) return null

    // const isModal = !!(
    //   location.state && location.state.modal
    //   && this.previousLocation !== location // not first render
    //   )
    let hotel
    let newMatch = matchPath(location.pathname, { path: match.url + "/:hotelId" })
    if (newMatch) {
      const { params } = newMatch
      if (params.hotelId) {
        const hotelId = parseInt(params.hotelId, 10)
        hotel = listModel.getItem(items, hotelId)
      }
    }

    const breadcrumb = [
      {to: match.url, label: "Hotels" },
    ]

    if (hotel) {
      breadcrumb.push({
        to: `${match.url}/${hotel.id}`,
        label: hotel.name
      })
    }

    if ((new RegExp(`${match.url}/new`)).test(location.pathname)) {
      // add the new into breadcrumb
      breadcrumb.push({
        to: `${match.url}/new`,
        label: "Add New"
      })
    }

    if ((new RegExp(`${match.url}/room-types`)).test(location.pathname)) {
      // add the new into breadcrumb
      breadcrumb.push({
        to: `${match.url}/room-types`,
        label: "Room Types"
      })
    }

    if ((new RegExp(`${match.url}/meal-plans`)).test(location.pathname)) {
      // add the new into breadcrumb
      breadcrumb.push({
        to: `${match.url}/meal-plans`,
        label: "Meal Plans"
      })
    }

    if ((new RegExp(`${match.url}/room-types/new`)).test(location.pathname)) {
      // add the new into breadcrumb
      breadcrumb.push({
        to: `${match.url}/room-types/new`,
        label: "Add New"
      })
    }

    if ((new RegExp(`${match.url}/meal-plans/new`)).test(location.pathname)) {
      // add the new into breadcrumb
      breadcrumb.push({
        to: `${match.url}/meal-plans/new`,
        label: "Add New"
      })
    }

    return  <div>
      <Breadcrumb breadcrumb={breadcrumb}>
        <Switch>
          <Route path={`${match.url}/room-types`}>
            <NavLink className="pull-right" to={`${match.url}/room-types/new`}>Add New Room Type</NavLink>
          </Route>
          <Route path={`${match.url}/meal-plans`}>
            <NavLink className="pull-right" to={`${match.url}/meal-plans/new`}>Add New Meal Plan</NavLink>
          </Route>
          <Route>
            <NavLink className="pull-right" to={`${match.url}/new`}>Add New Hotel</NavLink>
          </Route>
        </Switch>
      </Breadcrumb>
      <p className="text-right">
        <NavLink to={`${match.url}/room-types`}>Room Types</NavLink>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <NavLink to={`${match.url}/meal-plans`}>Meal Plans</NavLink>
      </p>
      <Switch>
        <Route path={`${match.url}/new`} component={New} />
        <Route path={`${match.url}/room-types`} component={RoomTypes} />
        <Route path={`${match.url}/meal-plans`} component={MealPlans} />
        <Route path={`${match.url}/:hotelId`} component={Show} />
        <Route path={match.url} component={List} />
      </Switch>
      {/*isModal ? <Route path="/a/items/:id" component={ShowInModal} />*/}
    </div>
  }
}

const mapStateToProps = (state) => ({
  items: state.hotels
})

export default withRouter(connect(mapStateToProps)(View))
