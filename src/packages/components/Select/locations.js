import React, { Component } from "react"
import Select from "./index"
import locationsApi from "./locationsApi"

export class LocationSelect extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      q: "",
      values: []
    }
    this.debouncer = undefined
  }

  getOptions = (q, callback) => {
    if (!q) return callback(null, { options: [] })
    clearTimeout(this.debouncer)
    this.debouncer = setTimeout(() => {
      locationsApi().index({ q })
        .then(response => {
          const { data: { data } } = response
          callback(null, {
            options: data.map(l => ({
              label: l.name,
              value: l.id
            }))
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
    return (
      <Select.Async
        name="locations[]"
        multi
        loadOptions={this.getOptions}
        placeholder="Type to search for locations..."
        onChange={this.handleChange}
        value={values}
        {...this.props}
      />
      )
  }
}

export default LocationSelect
