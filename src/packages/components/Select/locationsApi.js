import ajax from "api"

export const locationsApi = (state = {}) => {
  const { createAPI, baseURL } = ajax(state)
  const config = {
    baseURL: `${baseURL}`
  }

  const api = createAPI(config)

  return {
    index: function getLocations (params) {
      return api.get(
        `/locations`,
        {
          params
        }
        )
    }
  }
}

export default locationsApi
