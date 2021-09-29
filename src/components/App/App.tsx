import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Accounts from '../Accounts/Accounts';
import Portfolio from '../Portfolio/Portfolio'
import Dashboard from '../Dashboard/Dashboard';
import Toolbar from '../Toolbar/Toolbar';
import Transactions from '../Transactions/Transactions';
import TransactionForm from '../Transactions/TransactionForm/TransactionForm';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface State {
  isToolbarOpen: boolean;
}

class App extends Component {
  state: State;
  constructor(props: any) {
    super(props);
    this.state = {
      isToolbarOpen: false
    };
    this.collapseToolBar = this.collapseToolBar.bind(this);
  }

  toggleToolBar() {
    this.setState({isToolbarOpen: !this.state.isToolbarOpen});
  }

  collapseToolBar() {
    this.setState({isToolbarOpen: false});
  }

  render() {
    return (
      <Router>
      <div className = "App">
        <div className = "App-header">
          <div>
            <button className="toolbarButton"
              onClick={() => this.toggleToolBar()}><FontAwesomeIcon icon={faBars} /></button>
            PortfolioWatch
          </div>
        </div>
        <div className = "break"></div>
          <div className={`${this.state.isToolbarOpen ? "appToolbar": "appToolbarClosed"}`}>
            <Toolbar collapseToolBar={this.collapseToolBar} />
          </div>
          <div className={`${this.state.isToolbarOpen ? "appViewClosed": "appView"}`}>
            <Switch>
            <Route path = "/accounts" component = {Accounts}/>
            <Route path = "/cost-basis" component = {Portfolio}/>
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
