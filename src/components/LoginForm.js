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

  handleClick = (e) => {
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
      <div className='form'>
        <input id='pass' className={className} type='password' placeholder='password' value={pass} onChange={this.handleChange} />
        <button className='btn btn-success btn-outline' id='loginButton' onClick={this.handleClick}>Log in</button>
      </div>
    )
  }
}

export default LoginForm
