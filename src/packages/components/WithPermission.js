import { Children }  from "react"

import { connect } from "react-redux"

export const WithPermission = ({ user, permission, children }) => {
  if (!(user.status === "authenticated" && user.info === "fetched"))
    return null

  return Children.only(children)
}



export default connect(state => ({ user: state.user }))(WithPermission)
