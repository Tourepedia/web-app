import React, { Component } from "react"
import Select from "components/Select/"

import userApi from "./api"

export class UserSelect extends Component {
  constructor (...args) {
    super(...args)
    const { multi, user, users } = this.props
    this.state = {
      q: "",
      values: (multi && users)
        ? users.map(user => ({ label: user.name, value: user.id }))
        : user && { label: user.name, value: user.id }
    }
    this.debouncer = undefined
  }

  getOptions = (q, callback) => {
    clearTimeout(this.debouncer)
    this.debouncer = setTimeout(() => {
      userApi().index({ q })
        .then(response => {
          const { data: { data } } = response
          callback(null, {
            options: data.map(l => ({
              label: l.name,
              value: l.id
            })),
            // CAREFUL! Only set this to true when there are no more options,
            // or more specific queries will not be sent to the server.
            complete: true
          });
        })
    }, 300)
  }

  handleChange = (values) => {
    this.setState({
      values
    })
  }

  get value () {
    return this.state.values
  }

  render () {
    const { values } = this.state
    return <Select.Async
      name="users[]"
      loadOptions={this.getOptions}
      placeholder="Search or Select users..."
      onChange={this.handleChange}
      value={values}
      {...this.props}
       />
  }
}


export default UserSelect
