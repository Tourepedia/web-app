import axios from "axios"

// some default configuration
// axios.defaults.withCredentials = true

// prevent the default xsrf header addition
axios.defaults.xsrfCookieName = undefined


axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL

export const getSavedAuthTokens = () => window.localStorage.getItem("accessToken")

export const updateAuthTokens = (accessToken) => {
  window.localStorage.setItem("accessToken", accessToken)
}

export const removeAuthTokens = () => {
  window.localStorage.removeItem("accessToken")
}


const requestSuccessInterceptor = (config = {}) => {
  const authToken = getSavedAuthTokens()
  switch (config.method) {
    case "get":
    case "post":
    case "patch":
    case "put":
    case "delete":
    return {
      ...config,
      headers: {
        ...config.headers,
        "Authorization": `Bearer ${authToken}`
      }
    }
    default:
    console.log("Unhandled interceptor for method of type: ", config.method)
    return config
  }
}


const resposeFailedInterceptor = (error, routing = {}) => {
  const { response = {} } = error
  const { data = {} } = response
  if (error && error.name === "Error") {
    error.message = "Network error. Please try again."
  }

  // return the promise for further chaining
  return Promise.reject(data || error)
}

const createAPI = (config = {}, routing = {}) => {
  // create an instance as we would with normal axios
  // extract some custom options
  const { noInterceptor, noRequestInterceptor, noResponseInterceptor } = config
  const instance = axios.create(config)
  if (noInterceptor) {
    return instance
  }

  if (!noRequestInterceptor) {
      // intercept the request by adding auth tokens
      instance.interceptors.request.use(
        (request) => requestSuccessInterceptor(request, routing),
        (error) => Promise.reject(error)
        )
    }

    if (!noResponseInterceptor) {
      // intercept the response
      instance.interceptors.response.use(
        (response) => Promise.resolve(response),
        (error) => resposeFailedInterceptor(error, routing)
        )
    }
  // return the created axios instance
  return instance
}

export const ajax = (state = {}) => {
  const { user = {}, routing } = state
  const { data = {} } = user
  const userId = data.id
  const communityId = data.communityId
  const baseURL = axios.defaults.baseURL
  axios.withCreate = true
  return {
    userId,
    communityId,
    baseURL,
    createAPI: (config) => createAPI(config, routing)
  }
}

export default ajax
