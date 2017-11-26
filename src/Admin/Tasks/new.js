import React, { Component } from "react"

import { connect } from "react-redux"

import { Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col, Button, Alert } from "components"
import { createItem } from "./store"
import { LinkContainer } from "react-router-bootstrap"
import DatePicker from "components/DateTime"
import * as listModel from "listModel"
import { getServerTimestamp } from "timestamp"
const TODAY = new Date()

export class NewItem extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      created: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { meta } = nextProps
    if (!meta.isCreating && this.props.meta.isCreating) {
      this.setState({ created: true })
    }
  }

  handleCreateSubmit = (e) => {
    e.preventDefault()

    const { create } = this.props
    const subject = this.inputSubjectRef.value.trim()
    const description = this.inputDescriptionRef.value.trim()
    const due_date = this.inputDueDateRef.value
    if (due_date) {
      due_date.set({ hour: "23", minute: "59", second: "59" })
    }

    const data = {
      subject,
      description,
      due_date: getServerTimestamp(due_date),
    }
    create(data)
  }

  handleCloseCreatedAlert = (e) => {
    e.preventDefault()
    this.setState({
      created: false
    })
    // focus the input: Name
    if (this.inputNameRef) this.inputNameRef.focus()
  }

  render () {
    const { meta = {} } = this.props
    const { created } = this.state
    const { isCreating, lastCreatedId } = meta
    return (
      <div>
        {created ? (
          <Alert bsStyle="success" onDismiss={this.handleCloseCreatedAlert}>
            <h4>Success!!</h4>
            <p>Task successfull created.</p>
            <p>
              <LinkContainer to={`/a/tasks/${lastCreatedId}`}>
                <Button bsStyle="info" bsSize="sm" autoFocus>See Task</Button>
              </LinkContainer>
              {" "}
              <span> or </span>
              {" "}
              <Button bsSize="sm" onClick={this.handleCloseCreatedAlert}>Add More</Button>
            </p>
          </Alert>
          ) : (
        <Panel header={<div className="text-right">Fields marked with * are medantory.</div>}>
          <Form onSubmit={this.handleCreateSubmit} horizontal>
            <FormGroup
              controlId="newTask_name">
              <Col componentClass={ControlLabel} sm={2}>
                Subject *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  name="Subject"
                  placeholder="Send an email"
                  maxLength="100"
                  minLength="3"
                  required
                  autoFocus
                  inputRef={ref => { this.inputSubjectRef = ref }}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newTask_description">
              <Col componentClass={ControlLabel} sm={2}>
                Description
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  placeholder="A user required some info about something and so send the email to the user"
                  maxLength="10000"
                  rows={5}
                  inputRef={ref => { this.inputDescriptionRef = ref }}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newTask_due_date">
              <Col componentClass={ControlLabel} sm={2}>
                Due Date
              </Col>
              <Col sm={10}>
                <DatePicker
                  name="due_date"
                  inputTZ="local"
                  defaultValue={TODAY}
                  viewMode="days"
                  inputRef={ref => { this.inputDueDateRef = ref }}
                />
              </Col>
            </FormGroup>
            <FormGroup>
                {isCreating ? (
                  <Col smOffset={2} sm={10}>
                    <Button type="button" disabled>
                      Submitting...
                    </Button>
                  </Col>
                  ) : (
                  <Col smOffset={2} sm={10}>
                    <Button type="submit" bsStyle="primary">
                      Submit
                    </Button>
                    {" "}
                    <LinkContainer to="/a/tasks" exact>
                      <Button>
                        Cancel
                      </Button>
                    </LinkContainer>
                  </Col>
                  )}
            </FormGroup>
          </Form>
        </Panel>)}
      </div>
      )
  }
}

const mapStateToProps = (state) => {
  const items = state.tasks
  const meta = listModel.getMeta(items)
  return {
    meta
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    create: (...args) => dispatch(createItem(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItem)
