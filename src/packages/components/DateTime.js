import React, { Component } from "react"
import DateTime from "react-datetime"
import PropTypes from "prop-types"
import moment from "moment"
import elementType from 'prop-types-extra/lib/elementType'
import "react-datetime/css/react-datetime.css"

export class DatePicker extends Component {

  // this is from react-bootstrap formGroup controlId
  static contextTypes = {
    $bs_formGroup: PropTypes.object
  }

  static propTypes = {
    componentClass: elementType
  }

  static defaultProps = {
    independent: true,
    componentClass: "span",
    dateFormat: "DD MMMM, YYYY",
    closeOnSelect: true,
    timeFormat: false
  }

  constructor (...args) {
    super(...args)
    const { defaultValue } = this.props
    this.state = {
      value: defaultValue
    }
  }

  componentDidMount () {
    const { inputRef } = this.props
    inputRef && inputRef(this)
  }

  handleOnChange = (value) => {
    const { onChange, independent } = this.props
    if (independent) {
      this.setState({
        value
      })
    }
    onChange && onChange(value)
  }

  isValidDate = (date) => {
    const { startDate, endDate } = this.props
    if (startDate && endDate) {
      return date.isAfter(startDate) && date.isBefore(endDate)
    }
    if (startDate) {
      return date.isAfter(startDate)
    }
    if (endDate) {
      return date.isBefore(endDate)
    }
    return true
  }

  get value () {
    return this.state.value
  }

  render () {
    const { inputProps = {}, independent, startDate, endDate, onChange, readOnly, componentClass: Component, dateFormat, ...otherProps } = this.props

    // control id passed from formGroup
    const formGroup = this.context.$bs_formGroup;
    const controlId = formGroup && formGroup.controlId;

    const { value } = this.state

    if (readOnly) {
      return <Component>{moment.utc(value).local().format(dateFormat)}</Component>
    }

    return <DateTime
      inputProps={{
        className: "form-control",
        name: "selected_date",
        placeholder: "DD MMMM, YYYY",
        id: controlId,
        readOnly: true,
        ...inputProps
      }}
      value={value}
      onChange={this.handleOnChange}
      isValidDate={this.isValidDate}
      dateFormat={dateFormat}
      {...otherProps}
      />
  }
}

export default DatePicker
