import React, { Component } from "react"
import { connect } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { fetchItem } from "./store"
import * as listModel from "listModel"
import moment from "moment"
import { Panel, Alert, Button } from "components"

export class ShowItem extends Component {
  constructor (...args) {
    super(...args)
    const { fetch } = this.props
    fetch().catch(_ => {})
  }

  render () {
    const { item } = this.props
    if (!item) {
      return null
    }

    const meta = listModel.getItemMeta(item)
    if (meta.isFetching) {
      return <h1 className="text-center">Loading...</h1>
    }

    if (!item.subject) {
      let message = "Something went wrong. Please try after some time. You know it happens.!!"
      if (meta.errors) {
        message = meta.errors.message
      }
      return <Alert bsStyle="danger">
          <h4>Oh snap! You got an error!</h4>
          <p>{message}</p>
          <p>
            <LinkContainer to="/a/tasks">
              <Button bsStyle="info">See List of tasks</Button>
            </LinkContainer>
          </p>
        </Alert>
    }
    let date
    if (item.due_date) {
      date = moment.utc(item.due_date).local()
    }
    return (<Panel>
      <div>
        {date ? (
          <p className="pull-right" title={date.format("YYYY-MM-DD HH:mm:ss")}>
            {date.fromNow()}
          </p>
        ) : null}
        <h1 className="media-heading">{item.subject}</h1>
        <p style={{ whiteSpace: "pre-wrap" }} className="text-muted">{item.description}</p>
      </div>
    </Panel>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.tasks
  const { match: { params } } = ownProps
  const id = parseInt(params.taskId, 10)
  const item = listModel.getItem(items, id)
  return {
    item
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { match : { params } } = ownProps
  const id = parseInt(params.taskId, 10)
  return {
    fetch : _ => dispatch(fetchItem(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowItem)
