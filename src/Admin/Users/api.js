import ajax from "api"

export default function usersApi (state = {}) {
  const { baseURL, createAPI } = ajax(state)
  const config = {
    baseURL: `${baseURL}`
  }
  const api = createAPI(config)
  return {
    index: function getItems (params) {
      return api.get(
        `/users`,
        {
          params
        }
      )
    },
    show: function getItem (id) {
      return api.get(
        `/users/${id}`
        )
    },
    store: function createItem (data) {
      return api.post(
        `/users`,
        { ...data }
        )
    }
  }
}
