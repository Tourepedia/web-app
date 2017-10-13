import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchItems } from "./store"

import * as listModel from "listModel"

import {
  Table,
  Panel
} from "components"
import { Link } from "react-router-dom"


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
          No Users added Yet.
        </p>
      </Panel>
    }

    return  <Table responsive striped bordered condensed hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {listModel.map(items, (item, i) => (
          <tr key={item.id}>
            <td>{i+1}</td>
            <td>
              <Link to={{
                pathname: `/a/hotels/meal-plans/${item.id}`,
                // show the item the modal
                state: { modal: true }
              }}>
                {item.name}
              </Link>
            </td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  }
}

const mapStateToProps = (state) => ({
  items: state.hotelMealPlans
})

const mapDispatchToProps = (dispatch) => ({
  fetch: (...args) => dispatch(fetchItems(...args))
})
export default connect(mapStateToProps, mapDispatchToProps)(ListItems)
