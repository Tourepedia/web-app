import React, { Component } from "react"
import DateTime from "react-datetime"
import PropTypes from "prop-types"
import moment from "moment"
import elementType from 'prop-types-extra/lib/elementType'
import classnames from "classnames"
import uid from "tpuid"
import "react-datetime/css/react-datetime.css"
import "./DateTimeStyles.css"

export class DatePicker extends Component {

  // this is from react-bootstrap formGroup controlId
  static contextTypes = {
    $bs_formGroup: PropTypes.object
  }

  static propTypes = {
    componentClass: elementType
  }

  static defaultProps = {
    inputClassName: "form-control",
    name: "selected_date",
    autoComplete: "off",
    disabled: false,
    required: false,
    independent: true, // is this component independent, should it handle the date start on it's own
    componentClass: "span", // component class for the readOnly dates
    dateFormat: "DD MMMM, YYYY", // date format to display in the input
    closeOnSelect: true, // should we close the picker on select
    timeFormat: false, // disable the time format
    inputTZ: "utc", // assumed input dates timezone
    clearable: true, // is this date clearable, clearing the date will set the date to it's default value
    strictComp: false, // whether or not use strict comparision in date validation in isValidDate method
    viewMode: "months", // view mode for the picker
  }

  constructor (...args) {
    super(...args)
    const { defaultValue, inputTZ } = this.props
    this.state = {
      value: defaultValue && (inputTZ === "utc" ? moment.utc(defaultValue).local() : moment(defaultValue))
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
    const { startDate, endDate, strictComp, isValidDate } = this.props
    // let the parent validate the input if parent wants
    if (isValidDate && !isValidDate(date)) {
      return false
    }
    if (startDate && endDate) {
      return date.isBetween(startDate, endDate, null, strictComp ? "()" : "[]")
    }
    if (startDate) {
      return strictComp ? date.isAfter(startDate) : date.isSameOrAfter(startDate)
    }
    if (endDate) {
      return strictComp ? date.isBefore(endDate) : date.isSameOrBefore(endDate)
    }

    return true
  }

  handleClearDate = (e) => {
    this.handleOnChange(undefined)
  }

  get value () {
    return this.state.value
  }

  render () {
    const { independent, startDate, endDate, onChange, readOnly, componentClass: Component,
      dateFormat, clearable, isValidDate,
      inputClassName, name, placeholder, id, autoComplete, disabled, autoFocus, required, ...otherProps } = this.props

    // control id passed from formGroup
    const formGroup = this.context.$bs_formGroup;
    const controlId = id || (formGroup && formGroup.controlId);

    const { value } = this.state

    if (readOnly) {
      return <Component>{moment.utc(value).local().format(dateFormat)}</Component>
    }

    return <Component className={classnames("rdt-container", {"rdt--clearable" : clearable && !disabled})}>
      <DateTime
        inputProps={{
          className: inputClassName,
          placeholder: placeholder || dateFormat,
          id: controlId,
          readOnly: true,
          name,
          disabled,
          autoComplete,
          autoFocus,
          required
        }}
        value={value}
        onChange={this.handleOnChange}
        isValidDate={this.isValidDate}
        dateFormat={dateFormat}
        {...otherProps}
        />
      {!disabled && (
        <button type="button" title="Reset" className="rdt__cleaner" onClick={this.handleClearDate}>&times;</button>
        )}
    </Component>
  }
}

export default DatePicker

export class DateRangePicker extends Component {
  static defaultProps = {
    intervals: []
  }
  constructor (...args) {
    super(...args)
    this.state = {
      startDate: undefined,
      endDate: undefined
    }
  }

  handleStartDateChange = (startDate) => {
    this.handleOnChange(startDate, this.state.endDate)
  }

  handleEndDateChange = (endDate) => {
    this.handleOnChange(this.state.startDate, endDate)
  }

  handleOnChange = (startDate, endDate) => {
    const { onChange, id } = this.props
    this.setState({
      startDate, endDate
    })
    onChange && onChange(startDate, endDate, id)
  }

  get dateRange () {
    return {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }
  }

  get startDate () {
    return this.state.startDate
  }

  get endDate () {
    return this.state.endDate
  }

  isDateValidToSelect = (date) => {
    const { intervals, isValidDate, id } = this.props
    const { startDate, endDate } = this.state

    if (isValidDate && !isValidDate(date, id)) {
      return false
    }

    // if any of the dates are selected then we don't locally validate the input as it's will be validated by updating the startDate and endDate props to the DatePicker
    if (startDate || endDate) {
      return true
    } else {
      // only let the date which are not in intervals to be selected
      if (intervals.length) {
        return intervals.every(interval => {
          const { startDate, endDate } = interval
          return !date.isBetween(startDate, endDate, null, "[]")
        })
      }
    }

    return true
  }

  get minStartDate () {
    const { endDate } = this.state
    const { intervals, startDate } = this.props
    if (!endDate || !intervals.length) {
      return startDate
    }

    // get the closest endDate to this endDate which is before this endDate
    let closestEndDate = startDate
    let lastDiff =  - Infinity
    for (let i =0; i < intervals.length; i++) {
      const interval = intervals[i]
      const diff = interval.endDate.diff(endDate)
      if (diff < 0 && diff > lastDiff) {
        // this endDate is before the endDate and is closer the previous one
        lastDiff = diff
        closestEndDate = interval.endDate
      }
    }

    return closestEndDate
  }

  get maxEndDate () {
    const { startDate } = this.state
    const { intervals, endDate } = this.props
    if (!startDate || !intervals.length) {
      return endDate
    }

    // get the closest startDate to this startDate which is after this startDate
    let closestStartDate = endDate
    let lastDiff =  Infinity
    for (let i =0; i < intervals.length; i++) {
      const interval = intervals[i]
      const diff = interval.startDate.diff(startDate)
      if (diff > 0 && diff < lastDiff) {
        // this startDate is after the startDate and is closer the previous one
        lastDiff = diff
        closestStartDate = interval.startDate
      }
    }

    return closestStartDate
  }

  render () {
    const { startDate, endDate } = this.state
    const { onChange, startDateProps, endDateProps, autoFocus, isValidDate, ...otherProps} = this.props
    const minStartDate = this.minStartDate
    const maxEndDate = this.maxEndDate
    return <span className="rdt-range">
      <span className="rdt-range__date">
        <DatePicker
          startDate={minStartDate}
          endDate={endDate}
          onChange={this.handleStartDateChange}
          autoFocus={autoFocus}
          isValidDate={this.isDateValidToSelect}
          strictComp={minStartDate}
          {...startDateProps}
          {...otherProps}
          />
      </span>
      <span className="rdt-range__divider"></span>
      <span className="rdt-range__date">
        <DatePicker
          startDate={startDate}
          endDate={maxEndDate}
          onChange={this.handleEndDateChange}
          isValidDate={this.isDateValidToSelect}
          strictComp={minStartDate}
          {...endDateProps}
          {...otherProps}
          />
      </span>
    </span>
  }
}

export class DateRangePickerList extends Component {
  static defaultProps = {
    minIntervals: 1
  }
  constructor (...args) {
    super(...args)
    const { minIntervals } = this.props
    this.intervalsById = {}
    let intervals = []
    for (let i = 0; i < minIntervals; i++) {
      const interval = this.baseInterval
      this.intervalsById[interval.id] = interval
      intervals.push(interval.id)
    }
    this.state = {
      intervals
    }

  }
  get intervals () {
    const intervals = []
    for (let i = 0; i < this.state.intervals.length; i++) {
      const id = this.state.intervals[i]
      const interval = this.intervalsById[id]
      const { startDate, endDate } = interval
      if (startDate && endDate) {
        intervals.push(interval)
      }
    }
    return intervals
  }

  get value () {
    return this.intervals
  }

  get baseInterval () {
    const id = uid()
    return { id, startDate: undefined, endDate: undefined }
  }

  handleAddMore = e => {
    if (!this.canAddMoreInterval) {
      return
    }
    const newInterval = this.baseInterval
    this.intervalsById[newInterval.id] = newInterval
    this.setState(prevState => ({
      intervals: [...prevState.intervals,  newInterval.id]
    }))
  }

  handleRemove = (e) => {
    const id = e.target.id
    delete this.intervalsById[id]
    this.setState(prevState => ({ intervals: prevState.intervals.filter(intervalId => intervalId !== id) }))
  }

  handleChange = (startDate, endDate, intervalId) => {
    this.intervalsById[intervalId] = {
      ...this.intervalsById[intervalId],
      startDate, endDate
    }
    // now update the items
    this.forceUpdate()
  }

  get canAddMoreInterval () {
    return this.state.intervals.every(intervalId => {
      const interval = this.intervalsById[intervalId]
      return interval.startDate && interval.endDate
    })
  }

  render () {
    const { intervals } = this.state
    const { minIntervals, isValidDate, ...otherProps} = this.props
    return <div className="rdt-range-list">
      {intervals.map((intervalId, i) => (
        <div className="rdt-range-list__item" key={intervalId}>
          <div className="rdt-range-list__item__picker">
            <DateRangePicker
              id={intervalId}
              onChange={this.handleChange}
              intervals={this.intervals}
              disabled={i < intervals.length - 1}
              {...otherProps} />
          </div>
          {intervals.length > minIntervals ? (
            <button className="rdt-range-list__item__remover" type="button" title="Delete interval" id={`${intervalId}`}
              onClick={this.handleRemove}>&times;</button>
            ) : null}
        </div>
        ))}
      <button className="btn btn-info btn-sm btn-block" type="button" disabled={!this.canAddMoreInterval}
      onClick={this.handleAddMore}>Add More Intervel</button>
    </div>
  }
}
