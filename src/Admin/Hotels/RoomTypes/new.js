import React, { Component } from "react"

import { connect } from "react-redux"

import { Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col, Button, Alert } from "components"
import { createItem } from "./store"
import { LinkContainer } from "react-router-bootstrap"

import * as listModel from "listModel"

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
    const name = this.inputNameRef.value.trim()
    const description = this.inputDescriptionRef.value.trim()
    const no_of_beds = parseInt(this.inputNoOfBedsRef.value, 10)
    const adult_extra_beds = parseInt(this.inputAllowedAdultExtraBed.value, 10)
    const child_extra_beds = parseInt(this.inputAllowedChildExtraBed.value, 10)
    const allowed_both_extra_beds = this.inputAllowedBothExtraBeds.checked ? 1 : 0

    const data = { name, description, no_of_beds, adult_extra_beds, child_extra_beds, allowed_both_extra_beds }

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
            <p>Room Type successfully created.</p>
            <p>
              <LinkContainer to={`/a/hotels/room-types/${lastCreatedId}`}>
                <Button bsStyle="info" bsSize="sm" autoFocus>See Room Type</Button>
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
              controlId="newHotelRoomType_name">
              <Col componentClass={ControlLabel} sm={2}>
                Name *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Single"
                  maxLength="100"
                  required
                  autoFocus
                  inputRef={ref => { this.inputNameRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Room Type's name should be unique with minimum 1 chars to maximum 100 chars.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotelRoomType_description">
              <Col componentClass={ControlLabel} sm={2}>
                Description *
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  placeholder="A room which has single bed facility"
                  maxLength="1000"
                  required
                  inputRef={ref => { this.inputDescriptionRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Some description about the room type.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotelRoomType_no_of_beds">
              <Col componentClass={ControlLabel} sm={2}>
                No. of Beds *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="number"
                  placeholder="2"
                  min="1"
                  defaultValue="2"
                  required
                  inputRef={ref => { this.inputNoOfBedsRef = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Number of base beds allowed in the room.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotelRoomType_allowed_adult_extra_bed">
              <Col componentClass={ControlLabel} sm={2}>
                Adult Extra Beds *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="number"
                  placeholder="2"
                  min="0"
                  defaultValue="1"
                  required
                  inputRef={ref => { this.inputAllowedAdultExtraBed = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Number of allowed extra bed for adults.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotelRoomType_allowed_child_extra_bed">
              <Col componentClass={ControlLabel} sm={2}>
                Child Extra Beds *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="number"
                  placeholder="2"
                  min="0"
                  defaultValue="1"
                  required
                  inputRef={ref => { this.inputAllowedChildExtraBed = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Number of allowed extra bed for children.</HelpBlock>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="newHotelRoomType_allow_both_extra_beds">
              <Col componentClass={ControlLabel} sm={2}>
                Allow Both Extra Beds *
              </Col>
              <Col sm={10}>
                <FormControl
                  type="checkbox"
                  inputRef={ref => { this.inputAllowedBothExtraBeds = ref }}
                />
                <FormControl.Feedback />
                <HelpBlock>Are adult and child extra beds allowed at the same time in a room.</HelpBlock>
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
                    <LinkContainer to="/a/hotels/room-types">
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
  const items = state.hotelRoomTypes
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
