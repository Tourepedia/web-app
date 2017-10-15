import ajax from "api"

export default function hotelsApi (state = {}) {
  const { baseURL, createAPI } = ajax(state)
  const config = {
    baseURL: `${baseURL}`
  }
  const api = createAPI(config)
  return {
    index: function getItems (params) {
      return api.get(
        `/hotels`,
        {
          params
        }
      )
    },
    search: function searchHotels (params) {
      return api.get(
        `/hotels/search`,
        {
          params
        }
        )
    },
    show: function getItem (id) {
      return api.get(
        `/hotels/${id}`
        )
    },
    store: function createItem (data) {
      return api.post(
        `/hotels`,
        { ...data }
        )
    },
    addContact: function addContactToItem (hotelId, contact) {
      return api.post(
        `/hotels/${hotelId}/add-contact`,
        { ...contact }
        )
    },
    getMealPlans: function getMealPlans (params) {
      return api.get(
        `/hotel-meal-plans`,
        {
          params
        }
      )
    },
    getRoomTypes: function getRoomTypes (params) {
      return api.get(
        `/hotel-room-types`,
        {
          params
        }
      )
    },
    addPrice: function getRoomTypes (hotelId, price) {
      return api.post(
        `/hotels/${hotelId}/add-price`,
        {
          ...price
        }
      )
    },
  }
}
