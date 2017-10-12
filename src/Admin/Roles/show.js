import React, { Component } from "react"
import { connect } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { fetchItem } from "./store"

import * as listModel from "listModel"

import { Panel, Alert, Button } from "components"


export class ShowItem extends Component {
  constructor (...args) {
    super(...args)
    const { fetch } = this.props
    fetch().catch(_ => {})

    this.state = {
      showAddContact: false
    }
  }
  toggleShowAddContactState = (e) => {
    e.preventDefault()
    this.setState(prevState => ({
      showAddContact: !prevState.showAddContact
    }))
  }

  handleAddContact = (data) => {
    const { addContact } = this.props
    addContact(data)
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
            <LinkContainer to="/a/roles">
              <Button bsStyle="info">See List of Roles</Button>
            </LinkContainer>
          </p>
        </Alert>
    }
    return (<Panel bsStyle="primary" header={
      <div>
        <h1>{item.name}</h1>
      </div>
    }>
      <p>{item.description}</p>
    </Panel>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.roles
  const { match: { params } } = ownProps
  const id = parseInt(params.roleId, 10)
  const item = listModel.getItem(items, id)
  return {
    item
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const id = parseInt(params.roleId, 10)
  return {
    fetch : _ => dispatch(fetchItem(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowItem)
