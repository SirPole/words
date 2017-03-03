import React from 'react'

class Word extends React.Component {
  render () {
    const { id, author, word } = this.props.data
    return (
      <span className="word" id={id} title={author}>
        {word}
      </span>
    )
  }
}

export default Word
