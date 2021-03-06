
import * as listModel from "listModel"
import api from "./api"

/**
 * Initial State
 */
const INITIAL_STATE = listModel.getBaseState()

/**
 * Action type constants
 */

export const ACTION_TYPE_FETCHING_ITEMS = "FETCHING_HOTEL_ROOM_TYPES"
export const ACTION_TYPE_FETCHED_ITEMS = "FETCHED_HOTEL_ROOM_TYPES"
export const ACTION_TYPE_FETCH_ITEMS_FAILED = "FETCH_HOTEL_ROOM_TYPES_FAILED"
export const ACTION_TYPE_FETCHING_ITEM = "FETCHING_HOTEL_ROOM_TYPE_ITEM"
export const ACTION_TYPE_FETCHED_ITEM = "FETCHED_HOTEL_ROOM_TYPE_ITEM"
export const ACTION_TYPE_FETCH_ITEM_FAILED = "FETCH_HOTEL_ROOM_TYPE_ITEM_FAILED"
export const ACTION_TYPE_CREATING_ITEM = "CREATING_HOTEL_ROOM_TYPE"
export const ACTION_TYPE_CREATED_ITEM = "CREATED_HOTEL_ROOM_TYPE"
export const ACTION_TYPE_CREATE_ITEM_FAILED = "CREATE_HOTEL_ROOM_TYPE_FAILED"

// action creators
export const fetchingItems = () => ({
  type: ACTION_TYPE_FETCHING_ITEMS
})

export const fetchedItems = (data) => ({
  type: ACTION_TYPE_FETCHED_ITEMS,
  payload: data
})

export const fetchItemsFailed = (errors) => ({
  type: ACTION_TYPE_FETCH_ITEMS_FAILED,
  payload: errors
})

export const fetchingItem = (id) => ({
  type: ACTION_TYPE_FETCHING_ITEM,
  payload: { id }
})

export const fetchedItem = (id, data) => ({
  type: ACTION_TYPE_FETCHED_ITEM,
  payload: {id, data}
})

export const fetchItemFailed = (id, errors) => ({
  type: ACTION_TYPE_FETCH_ITEM_FAILED,
  payload: {id, errors}
})

export const creatingItem = (data) => ({
  type: ACTION_TYPE_CREATING_ITEM,
  payload: data
})

export const createdItem = (data) => ({
  type: ACTION_TYPE_CREATED_ITEM,
  payload: data
})

export const createItemFailed = (errors) => ({
  type: ACTION_TYPE_CREATE_ITEM_FAILED,
  payload: errors
})


// Thunks
// fetch list of items
export const fetchItems = (params = {}) => (dispatch, getState) => {
  dispatch(fetchingItems())
  return api(getState()).index(params)
    .then(response => {
      const { data } = response
      dispatch(fetchedItems(data.data))
      return Promise.resolve(data)
    })
    .catch(error => {
      dispatch(fetchItemsFailed(error))
      return Promise.reject(error)
    })
}

// fetch an item with id
export const fetchItem = (itemId) =>  (dispatch, getState) => {
    if (!itemId) return

  dispatch(fetchingItem(itemId))
  return api(getState()).show(itemId)
    .then(response => {
      const { data } = response
      dispatch(fetchedItem(itemId, data.data))
      return Promise.resolve(data)
    })
    .catch(error => {
      dispatch(fetchItemFailed(itemId, error))
      return Promise.reject(error)
    })
}

// create an item
export const createItem = (data) => (dispatch, getState) => {
  dispatch(creatingItem(data))
  return api(getState()).store(data)
    .then(response => {
      const { data } = response
      dispatch(createdItem(data.data))
      return Promise.resolve(data)
    })
    .catch(error => {
      dispatch(createItemFailed(error))
      return Promise.reject(error)
    })
}


/**
 * Reducer
 */

// Action handlers
const ACTION_HANDLERS = {
  [ACTION_TYPE_FETCHING_ITEMS]:  (state, payload) =>
    listModel.updateMeta(state, { isFetching: true, errors: undefined }),

  [ACTION_TYPE_FETCHED_ITEMS]: (state, payload) =>
    listModel.updateMeta(listModel.updateOrCreate(state, payload), { isFetching: false, errors: undefined }),

  [ACTION_TYPE_FETCH_ITEMS_FAILED]: (state, payload) =>
    listModel.updateMeta(state, { isFetching: false, errors: payload }),

  [ACTION_TYPE_FETCHING_ITEM]:  (state, payload) => {
    const { id } = payload
    return listModel.updateItemMeta(state, id, { isFetching: true, errors: undefined, valid: true })
  },

  [ACTION_TYPE_FETCHED_ITEM]: (state, payload) => {
    const { id, data } = payload
    return listModel.updateItemMeta(listModel.updateOrCreate(state, data), id, { isFetching: false, errors: undefined })
  },

  [ACTION_TYPE_FETCH_ITEM_FAILED]: (state, payload) => {
    const { id, errors } = payload
    return listModel.updateItemMeta(state, id, { isFetching: false, errors, valid: false })
  },

  [ACTION_TYPE_CREATING_ITEM]:  (state, payload) =>
    listModel.updateMeta(state, { isCreating: true, creationErrors: undefined }),

  [ACTION_TYPE_CREATED_ITEM]: (state, payload) =>
    listModel.updateMeta(listModel.updateOrCreate(state, payload), { isCreating: false, creationErrors: undefined, lastCreatedId: payload.id }),

  [ACTION_TYPE_CREATE_ITEM_FAILED]: (state, payload) =>
    listModel.updateMeta(state, { isCreating: false, creationErrors: payload }),

};


export default function hotelsReducer (state = INITIAL_STATE, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action.payload) : state
}
