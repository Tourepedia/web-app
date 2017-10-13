import React, { Component } from "react"
import { Route, Link, Switch } from "react-router-dom"
import { connect } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { fetchItem, updateRoles } from "./store"

import * as listModel from "listModel"

import { Panel, Alert, Button, Form, FormGroup, ControlLabel } from "components"
import RoleSelect from "./roleSelect"

export class EditRoles_ extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      updated: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { meta } = nextProps
    if (!meta.isUpdatingRoles && this.props.meta.isUpdatingRoles) {
      this.setState({ updated: true })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { update } = this.props
    const role = this.rolesInputRef.value.value
    update([role])
  }

  handleCloseUpdatedAlert = (e) => {
    e.preventDefault()
    this.setState({
      updated: false
    })
  }

  render () {
    const { roles, meta, match } = this.props
    const { updated } = this.state
    return <div>
      {updated ? <Alert bsStyle="success" onDismiss={this.handleCloseUpdatedAlert}>
        <p>
          <strong>Success!!</strong> User's role updated.
        </p>
        <p>
          <LinkContainer to={match.url.split("/").slice(0, -1).join("/")}>
            <Button bsSize="sm" autoFocus bsStyle="info">
              Done Editing
            </Button>
          </LinkContainer>
          <span> or </span>
          <Button bsSize="sm" type="submit" onClick={this.handleCloseUpdatedAlert}>Edit Again</Button>
        </p>
      </Alert> : <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <RoleSelect role={roles && roles[0]} ref={ref => { this.rolesInputRef = ref }} autoFocus />
        </FormGroup>
        {meta.isUpdatingRoles ? (
          <FormGroup>
            <Button bsSize="sm" disabled>Updating...</Button>
          </FormGroup>
          ) : (
          <FormGroup>
            <Button bsStyle="primary" bsSize="sm" type="submit">Update</Button>
            {" "}
            <LinkContainer to={match.url.split("/").slice(0, -1).join("/")}>
              <Button bsSize="sm">Cancel</Button>
            </LinkContainer>
          </FormGroup>)}
      </Form>}
    </div>
  }
}

const mapStateToProps_ = (state, ownProps) => {
  const items = state.users
  const { match: { params } } = ownProps
  const id = parseInt(params.userId, 10)
  const item = listModel.getItem(items, id)
  const meta = listModel.getItemMeta(item)
  return {
    roles: item.roles,
    meta
  }
}

const mapDispatchToProps_ = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const id = parseInt(params.userId, 10)
  return {
    update : (...args) => dispatch(updateRoles(id, ...args))
  }
}

export const EditRoles = connect(mapStateToProps_, mapDispatchToProps_)(EditRoles_)

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
            <LinkContainer to="/a/users">
              <Button bsStyle="info">See List of Users</Button>
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
        <Switch>
          <Route path={match.url} exact render={() => (
            <Link className="pull-right" to={`${match.url}/edit-roles`}>
              Edit Roles
            </Link>
            )}></Route>
          <Route path={`${match.url}/edit-roles`} render={() => (
            <Link className="pull-right" to={`${match.url}`}>
              Cancel Editing
            </Link>
            )}></Route>
        </Switch>
        <ControlLabel>
          Roles
        </ControlLabel>
        <Switch>
          <Route path={match.url} exact render={() => (
            <p>{item.roles.map(r => r.name).join(", ")}</p>
            )}></Route>
          <Route path={`${match.path}/edit-roles`} component={EditRoles}></Route>
        </Switch>
      </FormGroup>
    </Panel>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.users
  const { match: { params } } = ownProps
  const id = parseInt(params.userId, 10)
  const item = listModel.getItem(items, id)
  return {
    item
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const id = parseInt(params.userId, 10)
  return {
    fetch : _ => dispatch(fetchItem(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowItem)
