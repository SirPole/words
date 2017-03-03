import React from 'react'
import Word from './Word'

class Words extends React.Component {
  render () {
    const words = this.props.data.map(item => <Word key={item.id} data={item} />)
    return (
      <div id="words" className="row">
        {words}
      </div>
    )
  }
}

export default Words
