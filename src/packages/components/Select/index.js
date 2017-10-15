import React, { Component } from "react"
import Select from "react-select"

import "react-select/dist/react-select.min.css"

export class Select_ extends Component {
  state = {
    value: undefined
  }
  get value () {
    return this.state.value
  }

  componentDidMount () {
    const { inputRef, autoFocus } = this.props
    inputRef && inputRef(this)

    if (this.selectRef && this.selectRef.focus && autoFocus) {
      this.selectRef.focus()
    }
  }

  handleOnChange = (value) => {
    this.setState({
      value
    })
  }
  render () {
    const { inputRef, ...otherProps } = this.props
    return <Select
      ref={ref => { this.selectRef = ref }}
      onChange={this.handleOnChange}
      closeOnSelect={!this.props.multi}
      value={this.state.value}
      noResultsText="No results found"
      {...otherProps} />
  }
}


export default Select_
