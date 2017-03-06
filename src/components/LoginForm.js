import React, { PropTypes } from 'react'

class LoginForm extends React.Component {
  static propTypes = {
    login : PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      pass   : '',
      failed : false
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value,
      failed        : false
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({
      pass   : '',
      failed : this.props.login(this.state.pass, status => !status)
    })
  }

  render () {
    const { pass, failed } = this.state
    let className          = 'form-control'
    if (failed) {
      className += ' failed'
    }
    return (
      <form className='form' onSubmit={this.handleSubmit}>
        <input id='pass' className={className} type='password' placeholder='password' value={pass} onChange={this.handleChange} />
        <button type='submit' className='btn btn-success btn-outline' id='loginButton'>Log in</button>
      </form>
    )
  }
}

export default LoginForm
