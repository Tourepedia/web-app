import React, { Component } from "react"
import Select from "components/Select/"

import api from "./api"

export class MealPlansSelect extends Component {
  constructor (...args) {
    super(...args)
    const { plan, plans } = this.props
    this.state = {
      q: "",
      values: plans
        ? plans.map(plan => ({ label: plan.name, value: plan.id }))
        : plan && { label: plan.name, value: plan.id }
    }
    this.debouncer = undefined
  }

  getOptions = (q, callback) => {
    clearTimeout(this.debouncer)
    this.debouncer = setTimeout(() => {
      api().getMealPlans({ q })
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
      name="meal_plans[]"
      multi
      closeOnSelect={false}
      loadOptions={this.getOptions}
      placeholder="Search or Select meal plans..."
      onChange={this.handleChange}
      value={values}
      {...this.props}
       />
  }
}


export default MealPlansSelect
