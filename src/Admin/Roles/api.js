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
        `/roles`,
        {
          params
        }
      )
    },
    show: function getItem (id) {
      return api.get(
        `/roles/${id}`
        )
    },
    store: function createItem (data) {
      return api.post(
        `/roles`,
        { ...data }
        )
    },
    getPermissions: function getPermissions () {
      return api.get(
        `/permissions/user`
        )
    },
    updatePermissions: function updateRolePermissions (roleId, permissions) {
      return api.post(
        `/roles/${roleId}/update-permissions`,
        {
          permissions
        }
        )
    }
  }
}
