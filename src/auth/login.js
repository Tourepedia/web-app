import React, { Component } from "react"

import { Redirect } from "react-router-dom"

import {
    Grid,
    Row,
    Col,
    Panel,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    // Checkbox,
} from "components"

// import { LinkContainer } from "react-router-bootstrap"

import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { login } from "./../store/user"

class Login extends Component {
  state = {
    email: process.env.REACT_APP_AUTH_EMAIL,
    password: process.env.REACT_APP_AUTH_PASSWORD,
    loginErrors: undefined
  }

  handleChangeEmail = e => {
    this.setState({
      email: e.target.value
    })
  }

  handleChangePassword = e => {
    this.setState({
      password: e.target.value
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user.status !== "authenticating" && this.props.user.status === "authenticating") {
      // login response has come
      if (nextProps.user.errors) {
        // there have been some errors
        this.setState({
          loginErrors: nextProps.user.errors
        })
      }
    }
  }

  login = (e) => {
    e.preventDefault()
    const { login } = this.props
    const email = this.state.email.trim()
    const password = this.state.password
    this.setState({
      loginErrors: undefined
    })
    login({email, password})
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { user } = this.props
    if (user.status === "authenticated") {
      return <Redirect to={from}/>
    }

    const { email, password, loginErrors } = this.state

    return (
      <div>
        <Grid>
          <Row>
            <Col mdOffset={2} md={8} lgOffset={3} lg={6}>
              <Form horizontal onSubmit={this.login}>
                <Panel header={<h3>Login</h3>} footer={<Row>
                  <Col smOffset={4} sm={6}>
                    {user.status === "authenticating" ? (
                          <Button type="button" bsStyle="info" disabled>
                            Signing in
                          </Button>
                          ) : (
                          <Button type="submit" bsStyle="primary">
                            Sign in
                          </Button>
                          )}
                        {/* <LinkContainer to="/forgot-password">
                          <Button bsStyle="link">Forgot your password ?</Button>
                        </LinkContainer> */}
                  </Col>
                </Row>} bsStyle={loginErrors ? "danger" : "primary"}>
                  {loginErrors ? (
                    <FormGroup className="text-danger">
                      <Col smOffset={4} sm={6}>
                        Invalid credentials. Please try again.
                      </Col>
                    </FormGroup>
                    ) : null}
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} sm={4}>
                      Email
                    </Col>
                    <Col sm={6}>
                      <FormControl type="email" placeholder="Email"
                        name="email" required autoFocus value={email} onChange={this.handleChangeEmail}
                        autoComplete="username email" />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={4}>
                      Password
                    </Col>
                    <Col sm={6}>
                      <FormControl type="password" placeholder="Password" name="password" required
                        value={password} onChange={this.handleChangePassword}
                        autoComplete="current-password" />
                    </Col>
                  </FormGroup>
                  {/*<FormGroup>
                    <Col smOffset={4} sm={6}>
                      <Checkbox>Remember me</Checkbox>
                    </Col>
                  </FormGroup>*/}
                </Panel>
              </Form>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    login: (...args) => dispatch(login(...args))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
