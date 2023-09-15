import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import {Link, withRouter} from 'react-router-dom'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="header">
      <ul className="header-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
        </li>
        <li className="links">
          <Link to="/" className="link">
            <p className="pradeep">Home</p>
            <AiFillHome className="log" />
          </Link>
          <Link to="/jobs" className="link">
            <p className="pradeep">Jobs</p>
            <BsBriefcase className="log" />
          </Link>
        </li>

        <li className="log-container">
          <button type="button" className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
        </li>
        <li className="hide-link">
          <Link to="/" className="link">
            <p className="pradeep">Home</p>
            <AiFillHome className="log" />
          </Link>
          <Link to="/jobs" className="link">
            <p className="pradeep">Jobs</p>
            <BsBriefcase className="log" />
          </Link>
          <button type="button" className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
          <FiLogOut className="log" onClick={onClickLogout} />
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
