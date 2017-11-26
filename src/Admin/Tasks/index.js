import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Route, Switch, withRouter, matchPath, Link } from "react-router-dom"
import { injectReducer } from "reducers"
import {default as reducer} from "./store"
import {
  Breadcrumb
} from "components"

import * as listModel from "listModel"
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
    injectReducer(this.context.store, { key: "tasks", reducer })
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
    let task
    const newMatch = matchPath(location.pathname, { path: match.url + "/:taskId" })
    if (newMatch) {
      const { params } = newMatch
      if (params.taskId) {
        const taskId = parseInt(params.taskId, 10)
        task = listModel.getItem(items, taskId)
      }
    }

    const breadcrumb = [
      {to: match.url, label: "Tasks" },
    ]

    if (task) {
      breadcrumb.push({
        to: `${match.url}/${task.id}`,
        label: task.subject
      })
    }

    if (location.pathname === match.url + "/new") {
      // add the new into breadcrumb
      breadcrumb.push({
        to: `${match.url}/new`,
        label: "Add New"
      })
    }

    return  <div>
      <Breadcrumb breadcrumb={breadcrumb}>
        <Link className="pull-right" to={`${match.url}/new`}>Add New</Link>
      </Breadcrumb>
      <Switch>
        <Route path={`${match.url}/new`} component={New} />
        <Route path={`${match.url}/:taskId`} component={Show} />
        <Route path={match.url} component={List} />
      </Switch>
      {/*isModal ? <Route path="/a/hotels/:id" component={ShowInModal} />*/}
    </div>
  }
}

const mapStateToProps = (state) => ({
  items: state.tasks
})

export default withRouter(connect(mapStateToProps)(View))
