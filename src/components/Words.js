import React, { PropTypes } from 'react'
import Word from './Word'

class Words extends React.Component {
  static propTypes = {
    data        : PropTypes.array,
    invalidWord : PropTypes.number
  }

  render () {
    const { data, invalidWord } = this.props
    const words                 = data.map(item => <Word key={item.id} data={item} invalidWord={invalidWord} />)
    return (
      <div id='words' className='row'>
        {words}
      </div>
    )
  }
}

export default Words
