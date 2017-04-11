import PropTypes from 'prop-types'
import React from 'react'

class Controls extends React.Component {
  static propTypes = {
    sync   : PropTypes.func,
    logout : PropTypes.func
  }

  handleSync = () => this.props.sync()

  handleLogout = () => this.props.logout()

  render () {
    return (
      <div className='controls'>
        <a onClick={this.handleSync}>Manual sync</a>
        <a onClick={this.handleLogout}>Log out</a>
      </div>
    )
  }
}

export default Controls
