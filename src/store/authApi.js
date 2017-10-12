import {
  removeAuthTokens,
  updateAuthTokens,
  getSavedAuthTokens,
  default as ajax
} from "api"

export default function auth (state = {}) {
  const { baseURL, createAPI } = ajax(state)
  const config = {
    baseURL: `${baseURL}/auth`
  }
  const api = createAPI(config)
  return {
    getInfo: function getUserInfo () {
      const authToken = getSavedAuthTokens()
      if (!authToken) return Promise.reject()

      return api.get(
        `/user`
        )
    },
    login: function login (user) {
      return api.post(
        `/login`,
        { ...user }
        ).then(response => {
          // save the token
          updateAuthTokens(response.data.data.access_token)
          return Promise.resolve(response)
        })
    },
    logout: function logout () {
      return api.delete(
        `/invalidate`
        ).then((response) => {
          // remove the tokens
          removeAuthTokens()
          return Promise.resolve(response)
        })
    },
    refresh: function refreshLogin () {
      return api.patch(
        `/refresh`
        ).then(response => {
          // save the token
          console.log(response.data.data)
          updateAuthTokens(response.data.data.access_token)
          return Promise.resolve(response)
        })
    }
  }
}
