import React, { PropTypes } from 'react'
import LastChar from './LastChar'
import WordCount from './WordCount'

class Form extends React.Component {
  static propTypes = {
    removeItem  : PropTypes.func,
    addItem     : PropTypes.func,
    lastChar    : PropTypes.string,
    invalidChar : PropTypes.bool,
    wordCount   : PropTypes.number,
    nextAuthor  : PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      word   : '',
      author : props.nextAuthor
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.nextAuthor !== this.state.author) {
      this.setState({
        author : nextProps.nextAuthor
      })
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.id] : e.target.value })
  }

  handleRemove = (e) => {
    e.preventDefault()
    this.props.removeItem()
  }

  handleAdd = (e) => {
    e.preventDefault()
    const { word, author } = this.state
    this.props.addItem(word, author)
    this.setState({
      word   : '',
      author : ''
    })
  }

  render () {
    const { word, author }                     = this.state
    const { lastChar, invalidChar, wordCount } = this.props
    return (
      <div className='form'>
        <div className='row'>
          <div className='col-md-8 col-sm-8 col-xs-6'>
            <LastChar lastChar={lastChar} invalidChar={invalidChar} />
          </div>
          <div className='col-md-4 col-sm-4 col-xs-6'>
            <WordCount wordCount={wordCount} />
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-8 col-xs-6'>
            <input id='word' name='word' type='text' placeholder='Nové slovo' className='form-control' value={word} onChange={this.handleChange} />
          </div>
          <div className='col-sm-4 col-xs-6'>
            <select id='author' className='form-control' value={author} onChange={this.handleChange}>
              <option value='Verča'>Verča</option>
              <option value='Martin'>Martin</option>
            </select>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-8 col-xs-12'>
            <button className='btn btn-outline btn-success' id='add' onClick={this.handleAdd}>Odeslat</button>
          </div>
          <div className='col-sm-4 col-xs-12'>
            <button className='btn btn-outline btn-danger' id='remove' onClick={this.handleRemove}>Odebrat poslední</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Form
