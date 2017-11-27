import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchItems } from "./store"

import * as listModel from "listModel"

import {
  Table,
  Panel
} from "components"
import { Link } from "react-router-dom"

import moment from "moment"


export class ListItems extends Component {

  componentDidMount() {
    const { fetch } = this.props
    fetch()
  }

  render () {
    const { items } = this.props

    const meta = listModel.getMeta(items)
    // show the loading icon if fetching
    if (meta.isFetching) {
      return <h1 className="text-center">Loading...</h1>
    }

    const itemsCount = listModel.itemsCount(items)

    if (itemsCount === 0) {
      return <Panel>
        <p className="text-center">
          No Tasks added Yet.
        </p>
      </Panel>
    }

    return  <Table responsive striped bordered condensed>
      <thead>
        <tr>
          <th>#</th>
          <th >Description</th>
          <th style={{ minWidth: "80px" }}>Due Date</th>
          <th>By</th>
        </tr>
      </thead>
      <tbody>
        {listModel.map(items, (item, i) => {
          let date
          if (item.due_date) {
            date = moment.utc(item.due_date).local()
          }
          return (
            <tr key={item.id}>
              <td>{i+1}</td>
              <td>
                <Link to={{
                  pathname: `/a/tasks/${item.id}`,
                  // show the item the modal
                  state: { modal: true }
                }} className="word--ellipsis">
                  <b>{item.subject}</b>&nbsp;-&nbsp;{item.description}
                </Link>
                {item.assignees && item.assignees.length ? <div>Assigned To: {item.assignees
                .map(user => user.name)
                .join(", ")}</div> : null}
              </td>
              <td title={date && date.format("YYYY-MM-DD HH:mm:ss")}>
                {date ? date.fromNow() : <span className="text-muted">Not set</span>}
              </td>
              <td>
                <div className="word--ellipsis" title={item.author.name+"<"+item.author.email+">"}>
                  {item.author.name}
                </div>
              </td>
            </tr>
          )})}
      </tbody>
    </Table>
  }
}

const mapStateToProps = (state) => ({
  items: state.tasks
})

const mapDispatchToProps = (dispatch) => ({
  fetch: (...args) => dispatch(fetchItems(...args))
})
export default connect(mapStateToProps, mapDispatchToProps)(ListItems)
