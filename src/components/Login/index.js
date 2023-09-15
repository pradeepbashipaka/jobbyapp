import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const logo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  getUsername = event => this.setState({username: event.target.value})

  getPassword = event => this.setState({password: event.target.value})

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <form className="login-container" onSubmit={this.onSubmitLoginForm}>
          <img src={logo} alt="website logo" className="job-logo" />
          <div className="each">
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="input"
              placeholder="Username"
              onChange={this.getUsername}
              value={username}
            />
          </div>

          <div className="each">
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="Password"
              onChange={this.getPassword}
              value={password}
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
