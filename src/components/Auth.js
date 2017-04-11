import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import { install } from '../js/Worker'
import LoginForm from './LoginForm'

class Auth extends React.Component {
  static propTypes = {
    'router' : PropTypes.object
  }

  static isLoggedIn = (cb) => {
    axios({
      url     : 'https://api.brychta.name?what=authorization',
      method  : 'get',
      headers : {
        'Authorization' : 'Bearer ' + localStorage.jwt
      }
    }).then(response => {
      cb(response.data.authorized)
    })
  }

  componentWillMount = () => this.check()

  componentDidMount = () => install()

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
        method  : 'post',
        data    : `app=Words&pass=${pass}`,
        url     : 'https://api.brychta.name',
        headers : {
          'Content-Type'  : 'application/x-www-form-urlencoded; charset=UTF-8',
          'Authorization' : 'Bearer ' + localStorage.jwt
        }
      }).then(response => {
        const { authorized, jwt } = response.data
        if (authorized) {
          localStorage.jwt = jwt
          this.props.router.replace('/')
        }
        cb(authorized)
      })
    }
  }

  render () {
    return (
      <div className='centered'>
        <LoginForm login={this.login} />
        <button className='js-push-button btn btn-primary btn-outline hidden' disabled>Enable Push Messages</button>
      </div>
    )
  }
}

export default Auth
