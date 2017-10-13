
import * as listModel from "listModel"
import api from "./api"

/**
 * Initial State
 */
const INITIAL_STATE = listModel.getBaseState()

/**
 * Action type constants
 */

export const ACTION_TYPE_FETCHING_ITEMS = "FETCHING_ROLES"
export const ACTION_TYPE_FETCHED_ITEMS = "FETCHED_ROLES"
export const ACTION_TYPE_FETCH_ITEMS_FAILED = "FETCH_ROLES_FAILED"
export const ACTION_TYPE_FETCHING_ITEM = "FETCHING_ROLE_ITEM"
export const ACTION_TYPE_FETCHED_ITEM = "FETCHED_ROLE_ITEM"
export const ACTION_TYPE_FETCH_ITEM_FAILED = "FETCH_ROLE_ITEM_FAILED"
export const ACTION_TYPE_CREATING_ITEM = "CREATING_ROLE"
export const ACTION_TYPE_CREATED_ITEM = "CREATED_ROLE"
export const ACTION_TYPE_CREATE_ITEM_FAILED = "CREATE_ROLE_FAILED"
export const ACTION_TYPE_ROLE_UPDATING_PERMISSIONS = "ROLE_UPDATING_PERMISSIONS"
export const ACTION_TYPE_ROLE_UPDATED_PERMISSIONS = "ROLE_UPDATED_PERMISSIONS"
export const ACTION_TYPE_ROLE_UPDATE_PERMISSIONS_FAILED = "ROLE_UPDATE_PERMISSIONS_FAILED"

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


export const updatingPermissions = (id) => ({
  type: ACTION_TYPE_ROLE_UPDATING_PERMISSIONS,
  payload: { id }
})
export const updatedPermissions = (id, data) => ({
  type: ACTION_TYPE_ROLE_UPDATED_PERMISSIONS,
  payload: { id, data }
})
export const updatePermissionsFailed  = (id, errors) => ({
  type: ACTION_TYPE_ROLE_UPDATE_PERMISSIONS_FAILED,
  payload: { id, errors }
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


export const updatePermissions = (roleId, permissions = []) => (dispatch, getState) => {
  if (!roleId || !permissions) return

  dispatch(updatingPermissions(roleId))
  return api(getState()).updatePermissions(roleId, permissions)
    .then(response => {
      const { data } = response
      dispatch(updatedPermissions(roleId, data.data))
      return Promise.resolve(data)
    })
    .catch(error => {
      dispatch(updatePermissionsFailed(roleId, error))
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

  [ACTION_TYPE_ROLE_UPDATING_PERMISSIONS]:  (state, payload) => {
    const { id } = payload
    return listModel.updateItemMeta(state, id, { isUpdatingPermissions: true, permissionUpdationErrors: undefined })
  },

  [ACTION_TYPE_ROLE_UPDATED_PERMISSIONS]: (state, payload) => {
    const { id, data } = payload
    return listModel.updateItemMeta(listModel.updateOrCreate(state, data), id, { isUpdatingPermissions: false, permissionUpdationErrors: undefined })
  },

  [ACTION_TYPE_ROLE_UPDATE_PERMISSIONS_FAILED]: (state, payload) => {
    const { id, errors } = payload
    return listModel.updateMeta(state, id, { isUpdatingPermissions: false, permissionUpdationErrors: errors })
  }


};


export default function hotelsReducer (state = INITIAL_STATE, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action.payload) : state
}
