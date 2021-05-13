import React, { Component } from 'react';
import './Toolbar.css';

class Toolbar extends Component {
  render() {
    return (
      <div className="Toolbar">
        <div className="Toolbar-item"><a href="/">Dashboard</a></div>
        <div className="Toolbar-item"><a href="/positions">Positions</a></div>
        <div className="Toolbar-item"><a href="/accounts">Accounts</a></div>
        <div className="Toolbar-item"><a href="/transactions">Transactions</a></div>
      </div>
    );
  }
}

export default Toolbar;
