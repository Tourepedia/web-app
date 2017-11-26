import React, { Component, }  from "react"

import { connect } from "react-redux"

export const withPermission = (WrappedComponent, permission) => connect(state => ({ user: state.user }), {})(class WithPermission extends Component {
  render () {
    const { user } = this.props
    if (!(user.status === "authenticated" && user.info === "fetched" && user.data.permissions.indexOf(permission) !== -1))
      return null
    return <WrappedComponent {...this.props} />
  }
})

export default withPermission
