import React, { PropTypes } from 'react'

class LastChar extends React.Component {
  static propTypes = {
    lastChar    : PropTypes.string,
    invalidChar : PropTypes.bool
  }

  render () {
    const { lastChar, invalidChar } = this.props
    let className                   = invalidChar ? 'invalid' : ''
    return (
      <p className='intro'>
        Poslední slovo končí na <span id='lastChar' className={className}>{lastChar}</span>
      </p>
    )
  }
}

export default LastChar
