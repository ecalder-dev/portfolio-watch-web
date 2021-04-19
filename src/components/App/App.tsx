import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Toolbar from '../Toolbar/Toolbar';
import Positions from '../Positions/Positions';

class App extends Component {
  render() {
    return (
      <Router>
      <div className = "App">
        <div className = "App-header">
          <label>
            PortfolioWatch
          </label>
        </div>
        <div className = "break"></div>
          <div className = "App-toolbar">
            <Toolbar />
          </div>
          <div className = "App-view">
            <Switch>
            <Route path = "*" component = {Positions}/>

            </Switch>
          </div>
      </div>

      </Router>
    );
  }
}

export default App;
