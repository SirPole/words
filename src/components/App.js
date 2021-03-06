import React from 'react'
import PropTypes from 'prop-types'
import Words from './Words'
import Form from './Form'
import Quote from './Quote'
import Alert from './Alert'
import Controls from './Controls'
import axios from 'axios'
import {
  install,
  notify
} from '../js/Worker'

const initialState = {
  data        : [],
  lastChar    : '',
  lastWord    : '',
  wordCount   : '',
  invalidWord : 0,
  invalidChar : false,
  alertText   : '',
  alertType   : ''
}

class App extends React.Component {
  static propTypes = {
    router : PropTypes.object
  }

  constructor () {
    super()
    if (localStorage.app) {
      const app = JSON.parse(localStorage.app)
      if (app.data && app.data.length) {
        this.state = JSON.parse(localStorage.app)
      } else {
        this.state = initialState
      }
    } else {
      this.state = initialState
    }
  }

  componentWillMount = () => this.run()

  componentDidMount = () => install()

  componentDidUpdate = () => this.save()

  componentWillUnmount = () => this.stop()

  init = () => {
    axios({
      url     : 'https://api.brychta.name?what=data',
      headers : {
        'Authorization' : 'Bearer ' + localStorage.jwt
      }
    }).then(response => {
      if (response.data.data) {
        response.data.data = JSON.parse(response.data.data)
      }
      notify('New word!', response.data.lastWord)
      this.setState(response.data)
    })
  }

  update = () => {
    axios({
      url     : 'https://api.brychta.name',
      headers : {
        'Authorization' : 'Bearer ' + localStorage.jwt
      }
    }).then(response => {
      if (this.state.wordCount !== response.data.wordCount) {
        // TODO download only new words
        this.init()
      }
    })
  }

  run = () => {
    if (typeof this.updating === 'undefined') {
      this.updating = setInterval(this.update, 5000)
    }
  }

  stop = () => {
    if (typeof this.updating !== 'undefined') {
      clearInterval(this.updating)
    }
  }

  save = () => {
    localStorage.app = JSON.stringify(this.state)
  }

  addItem = (word, author) => {
    axios({
      url     : 'https://api.brychta.name',
      method  : 'post',
      data    : `word=${word}&author=${author}`,
      headers : {
        'Content-Type'  : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization' : 'Bearer ' + localStorage.jwt
      }
    }).then(response => {
      if (response.data.err === 0) {
        this.setState({
          invalidChar : true,
          alertType   : 'danger',
          alertText   : 'The last/first leter combination is invalid :('
        })
      } else if (response.data.err < 0) {
        this.setState({
          invalidWord : -response.data.err,
          alertType   : 'danger',
          alertText   : 'Word already played :('
        })
      } else {
        const { data, wordCount } = this.state
        data.push({
          author : author,
          id     : response.data.err,
          word   : word
        })
        this.setState({
          data        : data,
          wordCount   : wordCount + 1,
          lastChar    : this.getLastChar(word),
          lastWord    : `${author} played "${word}"`,
          invalidWord : 0,
          invalidChar : false,
          alertType   : 'success',
          alertText   : `Successfully played "${word}"`
        })
      }
    })
  }

  removeItem = () => {
    axios({
      method  : 'delete',
      url     : 'https://api.brychta.name',
      headers : {
        'Authorization' : 'Bearer ' + localStorage.jwt
      }
    }).then(response => {
      if (response.err < 0) {
        this.init()
      } else {
        const { data, wordCount } = this.state
        this.setState({
          data      : data.slice(0, data.length - 1),
          wordCount : wordCount - 1,
          lastChar  : this.getLastChar(data[ data.length - 2 ].word)
        })
      }
    })
  }

  getLastChar = (word) => {
    let lastChar = word.substring(word.length - 2)
    if (lastChar !== 'ch') {
      lastChar = word.substring(word.length - 1)
    }
    return lastChar
  }

  dismissAlert = () => {
    this.setState({
      alertText : '',
      alertType : ''
    })
  }

  logout = () => {
    localStorage.jwt = undefined
    this.props.router.replace('/auth')
  }

  render () {
    const { data, invalidWord, wordCount, lastChar, invalidChar, alertText, alertType } = this.state
    const nextAuthor                                                                    = data[ data.length - 2 ] ? data[ data.length - 2 ].author : ''
    return (
      <div id='app'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6 col-xs-12 left-side'>
              <h2>Slova</h2>
              <Words data={data} invalidWord={invalidWord} />
            </div>
            <div className='col-md-6 col-xs-12 right-side'>
              <h2>Nové slovo</h2>
              <Form wordCount={parseInt(wordCount)} lastChar={lastChar} invalidChar={invalidChar} nextAuthor={nextAuthor} addItem={this.addItem} removeItem={this.removeItem} />
              <button className='js-push-button btn btn-primary btn-outline hidden' disabled>Enable Push Messages</button>
            </div>
          </div>
        </div>
        <Quote />
        <Alert text={alertText} type={alertType} dismiss={this.dismissAlert} />
        <Controls sync={this.init} logout={this.logout} />
      </div>
    )
  }
}

export default App
