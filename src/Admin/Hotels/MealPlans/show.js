import React, { Component } from "react"
import { connect } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { fetchItem } from "./store"

import * as listModel from "listModel"

import { Panel, Alert, Button, FormGroup, ControlLabel } from "components"

export class ShowItem extends Component {
  constructor (...args) {
    super(...args)
    const { fetch } = this.props
    fetch().catch(_ => {})
  }

  render () {
    const { item } = this.props
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
            <LinkContainer to="/a/hotels/meal-plans">
              <Button bsStyle="info">See List of Meal Plans</Button>
            </LinkContainer>
          </p>
        </Alert>
    }
    return (<Panel>
      <FormGroup>
        <ControlLabel>
          Name
        </ControlLabel>
        <div>{item.name}</div>
      </FormGroup>
      <hr/>
      <FormGroup>
        <ControlLabel>
          Description
        </ControlLabel>
        <p>{item.description}</p>
      </FormGroup>
    </Panel>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.hotelMealPlans
  const { match: { params } } = ownProps
  const id = parseInt(params.hotelMealPlanId, 10)
  const item = listModel.getItem(items, id)
  return {
    item
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const id = parseInt(params.hotelMealPlanId, 10)
  return {
    fetch : _ => dispatch(fetchItem(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowItem)
