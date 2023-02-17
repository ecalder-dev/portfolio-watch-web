import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import AccountsPage from '../Accounts/Accounts';
import Portfolio from '../Portfolio/Portfolio'
import Dashboard from '../Dashboard/Dashboard';
import Toolbar from '../Toolbar/Toolbar';
import Transactions from '../Transactions/Transactions';
import TransactionForm from '../Transactions/TransactionForm/TransactionForm';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const App = () => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const toggleToolBar = () => {
    setIsToolbarOpen(!isToolbarOpen);
  }
  return (
    <Router>
    <div className = "App">
      <div className = "App-header">
        <div>
          <button className="toolbarButton"
            onClick={() => toggleToolBar()}><FontAwesomeIcon icon={faBars} /></button>
          PortfolioWatch
        </div>
      </div>
      <div className = "break"></div>
        <div className={`${isToolbarOpen ? "appToolbar": "appToolbarClosed"}`}>
          <Toolbar/>
        </div>
        <div className={`${isToolbarOpen ? "appViewClosed": "appView"}`}>
          <Switch>
          <Route path = "/accounts" component = {AccountsPage}/>
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

export default App;
