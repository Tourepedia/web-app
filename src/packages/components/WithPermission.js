import { Children }  from "react"

import { connect } from "react-redux"

export const WithPermission = ({ user, permission, children }) => {
  if (!(user.status === "authenticated" && user.info === "fetched" && user.data.permissions.indexOf(permission) !== -1))
    return null

  return Children.only(children)
}



export default connect(state => ({ user: state.user }))(WithPermission)
