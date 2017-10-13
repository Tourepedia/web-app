import React, { Component } from "react"
import Select from "components/Select/"

import api from "./api"

export class RoomTypesSelect extends Component {
  constructor (...args) {
    super(...args)
    const { roomType, roomTypes } = this.props
    this.state = {
      q: "",
      values: roomTypes
        ? roomTypes.map(roomType => ({ label: roomType.name, value: roomType.id }))
        : roomType && { label: roomType.name, value: roomType.id }
    }
    this.debouncer = undefined
  }

  getOptions = (q, callback) => {
    clearTimeout(this.debouncer)
    this.debouncer = setTimeout(() => {
      api().getRoomTypes({ q })
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
      name="room_types[]"
      multi
      loadOptions={this.getOptions}
      closeOnSelect={false}
      placeholder="Search or Select room types..."
      onChange={this.handleChange}
      value={values}
      {...this.props}
       />
  }
}


export default RoomTypesSelect
