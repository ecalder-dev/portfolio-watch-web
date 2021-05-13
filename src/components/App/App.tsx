import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Toolbar from '../Toolbar/Toolbar';
import Positions from '../Positions/Positions';
import Dashboard from '../Dashboard/Dashboard';
import Accounts from '../Accounts/Accounts';
import Transactions from '../Transactions/Transactions';
import TransactionForm from '../Transactions/TransactionForm/TransactionForm';

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
            <Route path = "/positions" component = {Positions}/>
            <Route path = "/accounts" component = {Accounts}/>
            <Route path = "/transactions/form/:id" component = {TransactionForm}/>
            <Route path = "/transactions/form" component = {TransactionForm}/>
            <Route path = "/transactions" component = {Transactions}/>
            <Route path = "*" component = {Dashboard}/>
            </Switch>
          </div>
      </div>

      </Router>
    );
  }
}

export default App;
