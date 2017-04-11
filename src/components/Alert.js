import PropTypes from 'prop-types'
import React from 'react'

class Alert extends React.Component {
  static propTypes = {
    text    : PropTypes.string,
    type    : PropTypes.string,
    dismiss : PropTypes.func
  }

  handleClick = () => this.props.dismiss()

  autoHide = () => {
    this.hide = setTimeout(() => {
      this.props.dismiss()
      clearTimeout(this.hide)
    }, 10000)
  }

  render () {
    const { text, type } = this.props
    let className        = 'alert alert-' + type
    if (!text) {
      className += ' down'
    } else {
      this.autoHide()
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
