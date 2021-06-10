import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Accounts from '../Accounts/Accounts';
import CostBasisListing from '../CostBasisListing/CostBasisListing'
import Dashboard from '../Dashboard/Dashboard';
import Positions from '../Positions/Positions';
import Toolbar from '../Toolbar/Toolbar';
import Transactions from '../Transactions/Transactions';
import TransactionForm from '../Transactions/TransactionForm/TransactionForm';

class App extends Component {
  render() {
    return (
      <Router>
      <div className = "App">
        <div className = "App-header">
          <div>
            PortfolioWatch
          </div>
        </div>
        <div className = "break"></div>
          <div className = "App-toolbar">
            <Toolbar />
          </div>
          <div className = "App-view">
            <Switch>
            <Route path = "/positions" component = {Positions}/>
            <Route path = "/accounts" component = {Accounts}/>
            <Route path = "/cost-basis" component = {CostBasisListing}/>
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
