 import React, { Component } from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom"
import { Provider } from "react-redux"
import { connect } from "react-redux"
import { DotDotDot } from "components/"
import Header from "./header"

import Login from "./auth/login"
import { getUserInfo } from "./store/user"

import { WithAuthRoute } from "components/ConnectedAuth"
import { WithPermissionRoute } from "components/ConnectedPermission"
import Home from "./Home"
import About from "./About"
import Profile from "./Profile"
import E404 from "./E404"
import Admin from "./Admin"
import Logout from "./Logout/"
import "./App.css"

class App extends Component {
  state = {
    isCheckingAuth: false
  }
  componentWillUnmount () {
    this._unmounted = true
  }
  componentWillMount () {
    const { getUserInfo } = this.props
    this.setState({
      isCheckingAuth: true
    })
    getUserInfo()
      .catch(_ => {
        return Promise.resolve(_)
      })
      .then(_ => {
        if (!this._unmounted) {
          this.setState({
            isCheckingAuth: false
          })
        }
      })
  }
  shouldComponentUpdate (_, nextState) {
    if (this.state.isCheckingAuth !== nextState.isCheckingAuth)
      return true
    return false
  }
  render() {
    const { isCheckingAuth } = this.state
    if (isCheckingAuth) {
      return <h1 className="app-loading">Please wait <DotDotDot /></h1>
    }
    return (
      <Provider store={this.props.store}>
        <Router basename={process.env.REACT_APP_APPLICATION_BASE_URL}>
          <div>
            <Header />
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/about" exact component={About}/>
              <Route path="/login" component={Login}/>
              <Route path="/logout" component={Logout}/>
              <WithAuthRoute path="/profile" component={Profile}/>
              <WithPermissionRoute path="/a" permission="can_see_admin_dashboard" component={Admin} />
              <Route component={E404}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default connect(undefined, { getUserInfo })(App);
