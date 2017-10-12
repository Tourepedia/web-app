import { combineReducers } from 'redux'

export const makeRootReducer = (asyncReducers = {}, rootReducers = {}) => {
  return combineReducers({
    ...rootReducers,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers, store.rootReducers))
}

export default makeRootReducer
