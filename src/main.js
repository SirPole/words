/* eslint-disable */
import CSS from './stylesheets/main.scss'
/* eslint-enable */
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import App from './components/App'
import Auth from './components/Auth'

function check () {

}

const router = (
  <Router history={browserHistory}>
    <Route path='/' component={App} onEnter={check} />
    <Route path='/auth' component={Auth} />
  </Router>
)

ReactDOM.render(router, document.getElementById('main'))
