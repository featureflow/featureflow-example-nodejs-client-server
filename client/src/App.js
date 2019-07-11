import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

class App extends Component {
  state = {
    features: 'bob'
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ features: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/features'), body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    //console.log(body);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.callApi()
        .then(res => {
          this.setState({ features: res });
          console.log(this.state.features);
        })
        .catch(err => console.log(err));
  };

  render() {
    let featureList = Object.keys(this.state.features).map(function(keyName, keyIndex) {})
   /* let features = !!this.state.features?'':Object.keys(this.state.features).map(key =>
        <option value={key}>{features[key]}</option>
    );*/

    return (
      <div className="App">
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
        </header>

        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Features:</strong>
          </p>
          <p>{
            Object.keys(this.state.features).map(key =>
                (<p>{key} : {this.state.features[key]}</p>)
            )
          }</p>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default App;
