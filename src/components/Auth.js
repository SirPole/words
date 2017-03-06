import React, { PropTypes } from 'react'
import LoginForm from './LoginForm'
import axios from 'axios'

const connection = {
  method  : 'post',
  url     : '//words.mab.loc/login.php',
  headers : {
    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}

class Auth extends React.Component {
  static propTypes = {
    'router' : PropTypes.object
  }

  static isLoggedIn = (cb) => {
    axios({
      ...connection,
      data : `jwt=${localStorage.jwt}`
    }).then(response => {
      cb(response.data.authorized)
    })
  }

  componentWillMount = () => this.check()

  check = () => {
    Auth.isLoggedIn(status => {
      if (status) {
        this.props.router.replace('/')
      }
    })
  }

  login = (pass, cb) => {
    if (pass) {
      return axios({
        ...connection,
        data : `pass=${pass}`
      }).then(response => {
        localStorage.jwt = response.data.jwt || undefined
        this.props.router.replace('/')
        cb(response.data.authorized)
      })
    }
  }

  render () {
    return (
      <div className='centered'>
        <LoginForm login={this.login} />
      </div>
    )
  }
}

export default Auth
