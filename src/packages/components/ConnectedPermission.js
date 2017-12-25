// @flow
import * as React from "react"
import ConnectedAuth from "./ConnectedAuth"
import { Route, Redirect } from "react-router-dom"

type Props = {
  render: ({ hasPermssion: boolean, isAuthenticated: boolean, user?: {} }) => React.Node,
  permission: string,
};

export const ConnectedPermission = ({ render, permission }: Props): React.Node =>
  <ConnectedAuth render={({ isAuthenticated, user }) =>
    render({
      hasPermssion: isAuthenticated && user.permissions.indexOf(permission) !== -1,
      isAuthenticated: isAuthenticated,
      user: user
    })
  } />

export const withPermission = (WrappedComponent: React.ComponentType<{}>, permission: string) =>
  class WithPermission extends React.Component<{}> {
    render (): React.Node {
      return <ConnectedPermission
        permission={permission}
        render={({ hasPermssion }) => !hasPermssion
          ? null
          : <WrappedComponent {...this.props} />} />
    }
}

export const WithPermissionRoute = ({ component: Component, permission, ...rest }: { component: React.ComponentType<{}>, permission: string, rest: any }): React.Node => (
  <ConnectedPermission permission={permission} render={({ hasPermssion, isAuthenticated }) => (
    <Route {...rest} render={props => (
      hasPermssion ? (
        <Component {...props}/>
      ) : !isAuthenticated ? (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      ) : <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }}/>
    )}/>
    )} />
)

export default ConnectedPermission
