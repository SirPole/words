import React from 'react'
import Words from './Words'
import Form from './Form'
import axios from 'axios'

class App extends React.Component {

  constructor () {
    super()
    this.state = { data : [] }
  }

  componentDidMount () {
    setTimeout(() => {
      // this.init()
      this.run()
    }, 1000)
  }

  init () {
    axios({
      method  : 'post',
      url     : '//words.mab.loc/action.php',
      data    : 'action=init',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(response => {
      if (response.data.data) {
        response.data.data = JSON.parse(response.data.data)
      }
      this.setState(response.data)
    })
  }

  update () {
    axios({
      method : 'post',
      url    : '//words.mab.loc/action.php'
    }).then(response => {
      if (this.state.wordCount != response.data.wordCount) {
        this.init()
      }
    })
  }

  run () {
    if (typeof this.updating === 'undefined') {
      this.updating = setInterval(this.update.bind(this), 5000)
    }
  }

  addItem () {

  }

  deleteItem () {

  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <h2>Slova</h2>
            <Words data={this.state.data} />
          </div>
          <div className="col-sm-6 col-xs-12">
            <h2>Nové slovo</h2>
            <Form />
            <button className="js-push-button btn btn-primary btn-outline hidden" disabled>Enable Push Messages</button>
          </div>
        </div>
      </div>
    )
  }
}

export default App