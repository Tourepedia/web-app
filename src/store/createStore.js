import { applyMiddleware, compose, createStore as createReduxStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from 'reducers'
import userReducer from "./user"

const createStore = (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk]

  // add other middlewares
  if (process.env.NODE_ENV === "development") {
    // add logger just before the crash reporter
      const { createLogger } = require("redux-logger")
      const logger = createLogger()
      middleware.push(logger)
  }

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  let composeEnhancers = compose

  if (process.env.NODE_ENV === "development") {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const rootReducers = {
    user: userReducer
  }
  const store = createReduxStore(
    makeRootReducer(rootReducers),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )

  store.rootReducers = { ...rootReducers }
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('reducers', () => {
      const reducers = require('reducers').default
      store.replaceReducer(reducers(store.asyncReducers, store.rootReducers))
    })
  }

  return store
}

export default createStore
