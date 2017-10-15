import React, { Component } from "react"
import Select from "components/Select/"

import api from "./api"

export class RoomTypesSelect extends Component {
  static defaultProps = {
    name: "room_types[]",
    multi: true,
    placeholder: "Search or Select room types..."
  }

  constructor (...args) {
    super(...args)
    const { roomType, roomTypes } = this.props
    this.state = {
      q: "",
      values: roomTypes
        ? roomTypes.map(this.makeOption(roomType))
        : this.makeOption(roomType)
    }
    this.debouncer = undefined
  }

  makeOption = (roomType) => roomType && ({
    label: roomType.name, value: roomType.id, title: roomType.description
  })

  getOptions = (q, callback) => {
    clearTimeout(this.debouncer)
    this.debouncer = setTimeout(() => {
      api().getRoomTypes({ q })
        .then(response => {
          const { data: { data } } = response
          callback(null, {
            options: data.map(this.makeOption),
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
    const { multi, ...otherProps } = this.props
    return <Select.Async
      multi={multi}
      loadOptions={this.getOptions}
      closeOnSelect={!multi}
      onChange={this.handleChange}
      value={values}
      {...otherProps}
       />
  }
}


export default RoomTypesSelect
