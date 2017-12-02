// @flow
import { combineReducers } from 'redux'

type State = {} | null;
type Action = {
  type: string
};
type Reducer = (state:State, action: Action) => State;

type Store = {
  asyncReducers: {},
  rootReducers: {},
  replaceReducer: (reducer: Reducer) => void
};


export const makeRootReducer = (asyncReducers: {} = {}, rootReducers: {} = {}): Reducer => {
  return combineReducers({
    ...rootReducers,
    ...asyncReducers
  })
}

export const injectReducer = (store: Store, _reducerKeyValue: { key: string, reducer: Reducer }): void => {
  const { key, reducer } = _reducerKeyValue
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers, store.rootReducers))
}

export default makeRootReducer
