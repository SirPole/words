import React from 'react'
import LastChar from './LastChar'
import WordCount from './WordCount'

class Form extends React.Component {
  render () {
    return (
      <div className="form">
        <div className="row">
          <div className="col-md-8 col-sm-8 col-xs-6">
            <LastChar />
          </div>
          <div className="col-md-4 col-sm-4 col-xs-6">
            <WordCount />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-8 col-xs-6">
            <input id="word" name="word" type="text" placeholder="Nové slovo" className="form-control" />
          </div>
          <div className="col-sm-4 col-xs-6">
            <select name="author" id="author" className="form-control">
              <option value="Verča">Verča</option>
              <option value="Martin">Martin</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <button className="btn btn-outline btn-success" id="add" name="add" type="submit">Odeslat</button>
          </div>
          <div className="col-sm-6 col-xs-12">
            <button className="btn btn-outline btn-danger" id="remove" name="remove" type="submit">Odebrat poslední</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Form