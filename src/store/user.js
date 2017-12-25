/**
 * This file handles the user state
 */
// @flow
import authApi from "./authApi"

type UserState = {
  status: "unauthenticated" | "authenticating" | "authenticated" | "unauthenticating",
  info: string,
  data?: { id: number },
  errors?: {}
};

type State = {} | null;

type Action = { type: string, payload?: any };

type ActionDispatcher = (...args: any) => Action;

type GetState = () => State;

type Reducer = (state: State, action: Action) => State;

// initial state
const INITIAL_STATE: UserState = {
  status: "unauthenticated",
  info: "not-fetched",
  data: undefined,
  errors: undefined,
}


/*
 * Action type constants
 */
export const ACTION_TYPE_LOGIN_REQUEST: string = "LOGIN_REQUEST"
export const ACTION_TYPE_LOGIN_SUCCESS: string = "LOGIN_SUCCESS"
export const ACTION_TYPE_LOGIN_FAILED: string = "LOGIN_FAILED"
export const ACTION_TYPE_LOGOUT_REQUEST: string = "LOGOUT_REQUEST"
export const ACTION_TYPE_LOGOUT_SUCCESS: string = "LOGOUT_SUCCESS"
export const ACTION_TYPE_LOGOUT_FAILED: string = "LOGOUT_FAILED"
export const ACTION_TYPE_USER_INFO_REQUEST: string = "USER_INFO_REQUEST"
export const ACTION_TYPE_USER_INFO_SUCCESS: string = "USER_INFO_SUCCESS"
export const ACTION_TYPE_USER_INFO_FAILED: string = "USER_INFO_FAILED"

// actions
export const loginRequest = () => ({
  type: ACTION_TYPE_LOGIN_REQUEST
})

export const loginSuccess = (data: {} = {}) => ({
  type: ACTION_TYPE_LOGIN_SUCCESS
})

export const loginFailed = (errors: {} = {}) => ({
  type: ACTION_TYPE_LOGIN_FAILED,
  payload: errors
})

export const logoutRequest = () => ({
  type: ACTION_TYPE_LOGOUT_REQUEST
})

export const logoutSuccess = () => ({
  type: ACTION_TYPE_LOGOUT_SUCCESS
})

export const logoutFailed = (errors: {}) => ({
  type: ACTION_TYPE_LOGOUT_FAILED,
  payload: errors
})

export const userInfoRequest = () => ({
  type: ACTION_TYPE_USER_INFO_REQUEST
})

export const userInfoSuccess = (data: {}) => ({
  type: ACTION_TYPE_USER_INFO_SUCCESS,
  payload: data
})

export const userInfoFailed = (errors: {}) => ({
  type: ACTION_TYPE_USER_INFO_FAILED,
  payload: errors
})



// thunks
/**
 * Login the user
 * @param  {Object} data [description]
 * @return {[type]}      [description]
 */
export const login = (data: { email?: string, password?: string } = {}) => (dispatch: ActionDispatcher, getState: GetState) => {
  dispatch(loginRequest())
  return authApi(getState()).login(data)
    .then(response => {
      return dispatch(getUserInfo())
    })
    .catch(error => {
      dispatch(loginFailed(error))
      return Promise.reject(error)
    })
}

/**
 * Logout the user
 * @param  {[type]} ) [description]
 * @return {[type]}   [description]
 */
export const logout = () => (dispatch: ActionDispatcher, getState: GetState) => {
  dispatch(logoutRequest())
  return authApi(getState()).logout()
    .then(response => {
      dispatch(logoutSuccess())
      return Promise.resolve(response.data)
    })
    .catch(error => {
      const { data= {} } = error
      const { status_code } = data
      if (status_code === 401) {
        dispatch(logoutSuccess())
        return Promise.resolve(error)
      }
      dispatch(logoutFailed(error))
      return Promise.reject(error)
    })
}


export const getUserInfo = () => (dispatch: ActionDispatcher, getState: GetState) => {
  dispatch(userInfoRequest())
  return authApi(getState()).getInfo()
    .then(response => {
      const { data } = response
      dispatch(userInfoSuccess(data.data))
      return Promise.resolve(data)
    })
    .catch(error => {
      dispatch(userInfoFailed(error))
      return Promise.reject(error)
    })
}

// reducers
const ACTION_HANDLERS = {
  [ACTION_TYPE_LOGIN_REQUEST]: (state, payload) => ({ ...state, status: "authenticating", errors: undefined }),

  [ACTION_TYPE_LOGIN_SUCCESS]: (state, payload) => ({ ...state, status: "authenticated", errors: undefined }),

  [ACTION_TYPE_LOGIN_FAILED]: (state, payload) => ({ ...state, status: "unauthenticated", errors: payload }),

  [ACTION_TYPE_USER_INFO_REQUEST]: (state, payload) => ({ ...state, info: "fetching", errors: undefined }),

  [ACTION_TYPE_USER_INFO_SUCCESS]: (state, payload) => ({ ...state, status: "authenticated", info: "fetched", data: payload, errors: undefined }),

  [ACTION_TYPE_USER_INFO_FAILED]: (state, payload) => ({ ...state,  status: "unauthenticated", info: "not-fetched", errors: payload }),

  [ACTION_TYPE_LOGOUT_REQUEST]: (state, payload) => ({ ...state,  status: "unauthenticating", errors: undefined }),

  [ACTION_TYPE_LOGOUT_SUCCESS]: (state, payload) => ({ ...state,  status: "unauthenticated", errors: undefined }),

  [ACTION_TYPE_LOGOUT_FAILED]: (state, payload) => ({ ...state,  status: "authenticated", errors: payload }),
}

const reducer: Reducer = (state: UserState | State = INITIAL_STATE, action: Action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action.payload) : state
}

export default reducer
