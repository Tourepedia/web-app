import React, { Component } from "react"
import Select from "components/Select/"

import api from "./api"

export class MealPlansSelect extends Component {
  static defaultProps = {
    name: "meal_plans[]",
    multi: true,
    placeholder: "Search or Select meal plans..."
  }
  constructor (...args) {
    super(...args)
    const { plan, plans } = this.props
    this.state = {
      q: "",
      values: plans
        ? plans.map(this.makeOption)
        : this.makeOption(plan)
    }
    this.debouncer = undefined
  }

  makeOption = (plan) => plan && ({ label: plan.name, value: plan.id, title: plan.description })

  getOptions = (q, callback) => {
    clearTimeout(this.debouncer)
    this.debouncer = setTimeout(() => {
      api().getMealPlans({ q })
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
      closeOnSelect={!multi}
      loadOptions={this.getOptions}
      onChange={this.handleChange}
      value={values}
      {...otherProps}
       />
  }
}


export default MealPlansSelect
