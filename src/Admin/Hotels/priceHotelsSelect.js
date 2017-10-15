import React, { Component } from "react"
import Select from "components/Select/"

import api from "./api"

export class PriceHotelsSelect extends Component {
  static defaultProps = {
    name: "hotels[]",
    multi: true,
    placeholder: "Search or Select hotels..."
  }
  constructor (...args) {
    super(...args)
    this.state = {
      values: undefined
    }
    this.debouncer = undefined
  }

  makeOption = (hotel) => hotel && ({ label: `${hotel.name}, ${hotel.location.short_name}`, value: hotel })

  getOptions = (q, callback) => {
    clearTimeout(this.debouncer)
    if (!q) {
      return callback(null, { options: [] })
    }
    const { tripStartDate } = this.props
    this.debouncer = setTimeout(() => {
      api().search({ q, tripStartDate,  with: ["prices"] })
        .then(response => {
          const { data: { data } } = response
          const options = data.reduce((data, hotel) => {
            // create an entry for each location for a hotel
            const { locations } = hotel
            for (let i = 0; i < locations.length; i++) {
              const location = locations[i]
              // filter out the prices only for this location
              const prices = hotel.prices.filter(price => price.locations.some(l => l.id === location.id))
              data.push(this.makeOption({ ...hotel, prices, location }))
            }
            return data
          }, [])
          callback(null, {
           options,
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

  filterOption = (option, q) => {
    const { value } = option
    const { location } = value
    const regex = new RegExp(q, "gi")
    return regex.test(`${value.name}`) || regex.test(`${location.name}`)
  }

  render () {
    const { values } = this.state
    const { multi, ...otherProps } = this.props
    return <Select.Async
      closeOnSelect={!multi}
      loadOptions={this.getOptions}
      onChange={this.handleChange}
      value={values}
      filterOption={this.filterOption}
      {...otherProps}
       />
  }
}


export default PriceHotelsSelect
