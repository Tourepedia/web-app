import React, { Component } from "react"
import { logout } from "./../store/user"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import "./logout.css"
import { DotDotDot } from "components/"

export class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }
  componentWillMount () {
    const { logout, history } = this.props
    logout().then(() => history.replace('/'))
  }

  render () {
    return <h1 className="logout-container">Logging out <DotDotDot /></h1>
  }
}

export default connect(
  (state) => ({ user: state.user }),
  { logout }
  )(Logout)
