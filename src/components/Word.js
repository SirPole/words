import PropTypes from 'prop-types'
import React from 'react'

class Word extends React.Component {
  static propTypes = {
    data : PropTypes.object
  }

  render () {
    const { id, author, word, invalidWord } = this.props.data
    let className                           = 'word'
    if (id === invalidWord) {
      className += ' invalid'
    }
    return (
      <span className={className} id={id} title={author}>
        {word}
      </span>
    )
  }
}

export default Word
