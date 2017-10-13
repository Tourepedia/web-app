import React, { Component } from "react"
import { Route, Switch, Link } from "react-router-dom"
import { connect } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { fetchItem, updatePermissions } from "./store"
import api from "./api"
import * as listModel from "listModel"

import { Panel, Alert, Button, FormGroup, ControlLabel, Form, Checkbox } from "components"


export class EditPermissions_ extends Component {
  constructor (...args) {
    super(...args)
    const { permissions = [] } = this.props

    // store the previour permissions as key:value and key being permission for better search
    this.prevPermissionsByKey = permissions.reduce((permissionsByKey, p) => {
      permissionsByKey[p.permission] = p
      return permissionsByKey
    }, {})

    this.state = {
      allPermissions: undefined,
      updated: false
    }

    this.inputPermissionsRefs = []
  }

  componentWillUnmount () {
    this._unmounted = true
  }

  componentDidMount () {
    api().getPermissions()
      .then(response => {
        const { data } = response
        if (!this._unmounted) {
          this.setState({
            allPermissions: data.data
          })
        }
      })
  }

  componentWillReceiveProps = nextProps => {
    const { meta } = nextProps
    if (!meta.isUpdatingPermissions && this.props.meta.isUpdatingPermissions) {
      this.setState({
        updated: true
      })
    }
  }

  handleUpdate = e => {
    e.preventDefault()
    const { update } = this.props
    const permissions = this.inputPermissionsRefs
      .filter(ref => ref.checked)
      .map(ref => ref.value);
    update(permissions)
  }

  handleCloseUpdateAlert = (e) => {
    e.preventDefault()
    this.inputPermissionsRefs = []
    this.setState({
      updated: false
    })
  }

  render () {
    const { match } = this.props
    const { allPermissions, updated } = this.state
    return updated ? (
      <Alert bsStyle="success" onDismiss={this.handleCloseUpdateAlert}>
          <p><strong>Success!!</strong> Role's permissions updated successfully.</p>
          <p>
            <LinkContainer to={match.url.split("/").slice(0, -1).join("/")}>
              <Button bsSize="sm" bsStyle="primary" autoFocus>
                Done Editing
              </Button>
            </LinkContainer>
            <span> or </span>
            <Button bsSize="sm" onClick={this.handleCloseUpdateAlert}>
              Edit Permissions
            </Button>
          </p>
        </Alert>
      ) : (
      <Form onSubmit={this.handleUpdate}>
        <FormGroup>
          {allPermissions ? (
            Object.keys(allPermissions).map(permission => (
              <Checkbox
                name="permissions[]"
                inputRef={ref => { this.inputPermissionsRefs.push(ref) }}
                defaultChecked={this.prevPermissionsByKey[permission]}
                key={permission}
                value={permission}
                >{permission}</Checkbox>
              ))
            ) : "Loading..."}
        </FormGroup>
        <FormGroup>
          <Button type="submit" bsStyle="primary">
            Update
          </Button>
          {" "}
          <LinkContainer to={match.url.split("/").slice(0, -1).join("/")}>
            <Button>
              Cancel
            </Button>
          </LinkContainer>
        </FormGroup>
      </Form>
      )
  }
}

const mapStateToProps_ = (state, ownProps) => {
  const items = state.roles
  const { match: { params } } = ownProps
  const id = parseInt(params.roleId, 10)
  const item = listModel.getItem(items, id)
  const meta = listModel.getMeta(item)
  return {
    permissions: item.permissions,
    meta
  }
}

const mapDispatchToProps_ = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const id = parseInt(params.roleId, 10)
  return {
    update : (...args) => dispatch(updatePermissions(id, ...args))
  }
}

export const EditPermissions = connect(mapStateToProps_, mapDispatchToProps_)(EditPermissions_)


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
            <LinkContainer to="/a/roles">
              <Button bsStyle="info">See List of Roles</Button>
            </LinkContainer>
          </p>
        </Alert>
    }
    return (<Panel bsStyle="primary" header={
      <div>
        <h1>{item.name}</h1>
        <p><em>{item.description}</em></p>
      </div>
    }>
      <FormGroup>
        <Route path={match.url} exact render={_ =>
          <Link to={`${match.url}/edit-permissions`} className="pull-right" >Edit Permission</Link>
          } />
        <Route path={`${match.path}/edit-permissions`} render={_ =>
          <Link to={match.url} className="pull-right" >Cancel Editing</Link>} />

        <ControlLabel>Permission</ControlLabel>
        <Switch>
          <Route path={match.url} exact render={() => {
            return (item.permissions && item.permissions.length ? <p>{item.permissions.map(permission =>
              <span key={permission.id}><span className="label label-info">{permission.permission}</span> </span>)}
            </p> : <p className="text-center">
              No Permissions Set. <br/>
              <LinkContainer to={`${match.url}/edit-permissions`}>
                <Button bsStyle="primary">Edit Permissions</Button>
              </LinkContainer>
            </p>)
          }} />
          <Route path={`${match.path}/edit-permissions`} component={EditPermissions} />
        </Switch>
      </FormGroup>
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
