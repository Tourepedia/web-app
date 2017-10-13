import ajax from "api"

export default function api (state = {}) {
  const { baseURL, createAPI } = ajax(state)
  const config = {
    baseURL: `${baseURL}`
  }
  const api = createAPI(config)
  return {
    index: function getItems (params) {
      return api.get(
        `/hotel-meal-plans`,
        {
          params
        }
      )
    },
    show: function getItem (id) {
      return api.get(
        `/hotel-meal-plans/${id}`
        )
    },
    store: function createItem (data) {
      return api.post(
        `/hotel-meal-plans`,
        { ...data }
        )
    }
  }
}
