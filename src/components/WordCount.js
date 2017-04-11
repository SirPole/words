import PropTypes from 'prop-types'
import React from 'react'

class WordCount extends React.Component {
  static propTypes = {
    wordCount : PropTypes.number
  }

  render () {
    return (
      <p className='intro'>
        Počet slov: <span id='wordCount'>{this.props.wordCount}</span>
      </p>
    )
  }
}

export default WordCount
