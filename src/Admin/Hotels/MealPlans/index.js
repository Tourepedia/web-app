import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Route, Switch, withRouter } from "react-router-dom"
import { injectReducer } from "reducers"
import {default as reducer} from "./store"

import List from "./list"
import Show from "./show"
import New from "./new"

export class View extends Component {
  // we need store from context type for adding reducer
  static contextTypes = {
    store: PropTypes.object
  }


  constructor (...args) {
    super(...args)
    injectReducer(this.context.store, { key: "hotelMealPlans", reducer })
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
      match,
    } = this.props
    // if no items, means that reducer is not attached yet
    if (!items) return null

    // const isModal = !!(
    //   location.state && location.state.modal
    //   && this.previousLocation !== location // not first render
    //   )

    return  <div>
      <Switch>
        <Route path={`${match.url}/new`} component={New} />
        <Route path={`${match.url}/:hotelMealPlanId`} component={Show} />
        <Route path={match.url} component={List} />
      </Switch>
      {/*isModal ? <Route path="/a/hotels/:id" component={ShowInModal} />*/}
    </div>
  }
}

const mapStateToProps = (state) => ({
  items: state.hotelMealPlans
})

export default withRouter(connect(mapStateToProps)(View))
