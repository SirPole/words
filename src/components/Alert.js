import React, { PropTypes } from 'react'

class Alert extends React.Component {
  static propTypes = {
    text    : PropTypes.string,
    type    : PropTypes.string,
    dismiss : PropTypes.func
  }

  handleClick = () => this.props.dismiss()

  render () {
    const { text, type } = this.props
    let className        = 'alert alert-' + type
    if (!text) {
      className += ' down'
    }
    return (
      <div className={className}>
        <button className='close' onClick={this.handleClick}>x</button>
        <p>{text}</p>
      </div>
    )
  }
}

export default Alert
