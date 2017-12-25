// @flow
import * as React from "react"
import { connect } from "react-redux"
import { Route, Redirect } from "react-router-dom"

type Props = {
  user: {
    status: "unauthenticated" | "authenticating" | "authenticated" | "unauthenticating",
    data?: {}
  },
  render: ({ isAuthenticated: boolean, user?: {} }) => React.Node
};

export const ConnectedAuth = connect(state => ({ user: state.user }))(
  ({ user, render }: Props): React.Node =>
    render({ isAuthenticated: user.status !== "unauthenticated" && user.status !== "authenticating", user: user.data }))

export default ConnectedAuth

export const withAuth = (WrappedComponent: React.ComponentType<{}>) =>
  class WithAuth extends React.Component<{}> {
    render (): React.Node {
      return <ConnectedAuth
        render={({ isAuthenticated }) => !isAuthenticated
          ? null
          : <WrappedComponent {...this.props} />} />
    }
}

export const WithAuthRoute = ({ component: Component, ...rest }: { component: React.ComponentType<{}>, rest: any }) => (
  <ConnectedAuth render={({ isAuthenticated }): React.Node => (
    <Route {...rest} render={props => (
      isAuthenticated ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )
    )}/>
    )} />
)
