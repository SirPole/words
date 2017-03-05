import React from 'react'
import LoginForm from './LoginForm'

class Auth extends React.Component {
  login = (pass) => {
    return false
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
