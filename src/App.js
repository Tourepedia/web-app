import React, { Component } from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom"
import { Provider } from "react-redux"
import { connect } from "react-redux"

import Header from "./header"

import Login from "./auth/login"
import { getUserInfo } from "./store/user"

import WithAuthRoute from "components/WithAuthRoute"
import WithPermissionRoute from "components/WithPermissionRoute"
import Home from "./Home"
import About from "./About"
import Profile from "./Profile"
import E404 from "./E404"
import Admin from "./Admin"

class App extends Component {
  componentWillMount () {
    const { getUserInfo } = this.props
    getUserInfo().catch(_ => {})
  }
  shouldComponentUpdate () {
    return false
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div>
            <Header />
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/about" exact component={About}/>
              <Route path="/login" component={Login}/>
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

export default connect(undefined, dispatch => ({ getUserInfo: _ => dispatch(getUserInfo()) }))(App);
