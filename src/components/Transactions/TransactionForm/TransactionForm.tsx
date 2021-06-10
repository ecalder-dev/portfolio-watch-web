import React from "react";
import "./TransactionForm.css";
import Transaction from "../../../models/Transaction";
import Account from "../../../models/Account";
import TransactionService from "../../../services/TransactionService";
import AccountService from "../../../services/AccountService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter } from "react-router-dom";

interface State {
  transactionId: number;
  type: string;
  symbol: string;
  shares: number;
  price: number;
  account: Account;
  dateTransacted: Date;
  dateSettled: Date;
  accountList: Account[];
  datetimeInserted: Date;
}

class TransactionForm extends React.Component<any, State> {
  state: State;
  typeList: string[];
  accountService: AccountService;
  transactionService: TransactionService;

  constructor(props: any) {
    super(props);
    this.typeList = ['B', 'S', 'TO', 'TI', 'M', 'G', 'SP'];
    this.accountService = new AccountService();
    this.transactionService = new TransactionService();

    this.state = {
      transactionId: null,
      type: this.typeList[0],
      symbol: '',
      shares: 1,
      price: 0,
      account: null,
      dateTransacted: null,
      dateSettled: null,
      accountList: [],
      datetimeInserted: null,
    };
  }

  componentDidMount() {
    this.accountService
      .getAccounts(false)
      .then((json) => {
        let firstAccount = null;
        let accountList = json.data;
        accountList.sort(function(a, b) {
          if (a.accountName > b.accountName) return -1;
          if (b.accountName > a.accountName) return 1;
          if (a.accountName === b.accountName) {
            if (a.accountNumber < b.accountNumber) return -1;
            if (b.accountNumber < a.accountNumber) return 1;
          }
          return 0;
        });
        this.setState({ accountList: accountList, account: firstAccount });
        const id = this.props.match.params.id;
        if (id) {
          this.transactionService.getTransaction(id).then((json) => {
            if (json.data) {
              let transaction: Transaction = json.data;
              this.setState({
                transactionId: transaction.transactionId,
                type: transaction.type,
                symbol: transaction.symbol,
                shares: transaction.shares,
                price: transaction.price,
                account: transaction.account,
                dateTransacted: transaction.dateTransacted,
                dateSettled: transaction.dateSettled,
                datetimeInserted: transaction.datetimeInserted,
              });
            } else {
              this.props.history.push('/transactions');
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  componentWillUnmount() {
    //this.transactionService.cancelRequest();
  }

  handleInputChange(e: any) {
    let value = e.target.value;
    let pattern = e.target.pattern;
    let name = e.target.name;

    if (pattern && value && !value.match(pattern)) {
      return;
    } else {
      switch (name) {
        case 'type': {
          this.setState({ type: value });
          break;
        }
        case 'symbol': {
          this.setState({ symbol: value ? value.toUpperCase() : '' });
          break;
        }
        case 'shares': {
          this.setState({ shares: value });
          break;
        }
        case 'price': {
          this.setState({ price: value });
          break;
        }
        case 'account': {
          let valInt = parseInt(value, 0);
          let found = this.state.accountList.filter(acct => acct.accountId === valInt);
          this.setState({
            account: found.length > 0 ? found[0] : null,
          });
          break;
        }
      }
    }
  }

  handleDateChange(date: any, name: string) {
    if (name === 'dateTransacted') {
      this.setState({ dateTransacted: date });
    } else if (name === 'dateSettled') {
      this.setState({ dateSettled: date });
    }
  }

  handleSubmit(e: any) {
    if (!this.validateNewTransaction()) {
      return;
    }

    let transaction: Transaction;
    transaction = {
      transactionId: this.state.transactionId,
      type: this.state.type,
      symbol: this.state.symbol,
      shares: this.state.shares,
      price: this.state.price,
      account: this.state.account,
      dateTransacted: this.state.dateTransacted,
      dateSettled: this.state.dateSettled,
      datetimeInserted: null,
      datetimeUpdated: null,
    };

    if (transaction.transactionId) {
      this.transactionService.putTransaction(transaction).then((json) => {
        if (json.data) {
          this.props.history.push('/transactions');
        }
      });
    } else {
      this.transactionService.postTransaction(transaction).then((json) => {
        if (json.data) {
          this.props.history.push('/transactions');
        }
      });
    }
  }

  validateNewTransaction(): boolean {
    if (!this.state) {
      alert('State is invalid.');
      return false;
    } else if (!this.state.account) {
      alert('Account should be selected.');
      return false;
    } else if (!this.state.symbol) {
      alert('Symbol should not be empty.');
      return false;
    } else if (!this.state.shares || this.state.shares === 0) {
      alert('Shares should should not be empty or 0.');
      return false;
    } else if (!this.state.dateTransacted) {
      alert('Transaction date should not be null.');
      return false;
    } else {
      return true;
    }
  }

  deleteTransaction() {
    if (window.confirm('Are you sure you want to delete this account?')) {
      let transaction: Transaction;
      transaction = {
        transactionId: this.state.transactionId,
        type: this.state.type,
        symbol: this.state.symbol,
        shares: this.state.shares,
        price: this.state.price,
        account: this.state.account,
        dateTransacted: this.state.dateTransacted,
        dateSettled: this.state.dateSettled,
        datetimeInserted: null,
        datetimeUpdated: null,
      };

      this.transactionService.deleteTransaction(transaction)
      .then(json => {
        this.props.history.push('/transactions');
      } )
      .catch(err => {
        console.log(err.message);
        alert('Transaction was not deleted.')
      });
    }
  }

  goToTransactionList() {
    this.props.history.push('/transactions');
  }

  toUpperCase(str: String) {
    if (str) {
      return str.toUpperCase();
    }
  }

  getAccountId(account: Account) {
    if (account) {
      return account.accountId;
    } else {
      return -1;
    }
  }

  getDescriptionOfType(type: string) {
    switch (type) {
      case 'B':
        return 'Buy';
      case 'S':
        return 'Sell';
      case 'TO':
        return 'Transfer Out';
      case 'TI':
        return 'Transfer In';
      case 'MT':
        return 'Merger Target';
      case 'MB':
        return 'Merger Buyer';
      case 'G':
        return 'Gift';
      case 'SP':
        return 'Split';
      default:
        return type;
    }
  }

  render() {
    return (
      <div className="TransactionForms">
        <h1 className="title">New Transaction</h1>
        <form>
          <div className="entry-row">
            <div className="entry">
              <label>Account</label>
              <select
                name="account"
                onChange={(e) => this.handleInputChange(e)}
                value={this.getAccountId(this.state.account)}
                id="select-account"
              >
                <option disabled value={-1}>
                  Select an Account
                </option>
                {this.state.accountList.map(
                  (account: Account, index: number) => (
                    <option key={index} value={account.accountId}>
                      {account.accountName +' (' + account.accountNumber + ')'}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="entry">
              <label>Type</label>
              <select
                name="type"
                onChange={(e) => this.handleInputChange(e)}
                value={this.state.type}
                id="select-type"
              >
                {this.typeList.map((type: string, index: number) => (
                  <option key={"type-" + index} value={type}>
                    {this.getDescriptionOfType(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="entry-row">
            <div className="entry">
              <label>Symbol</label>
              <input
                value={this.state.symbol}
                name="symbol"
                pattern="^[A-z]{1,5}$"
                onInput={(e) => this.handleInputChange(e)}
              />
            </div>
            <div className="entry">
              <label>Shares</label>
              <input
                value={this.state.shares}
                pattern="^\d*(\.\d{0,10})?$"
                name="shares"
                onInput={(e) => this.handleInputChange(e)}
              />
            </div>
            <div className="entry">
              <label>Price</label>
              <input
                value={this.state.price}
                pattern="^\d*(\.\d{0,10})?$"
                name="price"
                onInput={(e) => this.handleInputChange(e)}
              />
            </div>
          </div>
          <div className="entry-row">
            <div className="entry">
              <label>Date Transacted</label>
              <DatePicker
                selected={this.state.dateTransacted}
                onChange={(date) =>
                  this.handleDateChange(date, "dateTransacted")
                }
                dateFormat="M/d/yyyy"
              />
            </div>
            <div className="entry">
              <label>Date Settled</label>
              <DatePicker
                selected={this.state.dateSettled}
                onChange={(date) => this.handleDateChange(date, "dateSettled")}
                dateFormat="M/d/yyyy"
              />
            </div>
          </div>
        </form>
        <div className="entry-row">
          <button onClick={(e) => this.handleSubmit(e)}>Submit</button>
          <button onClick={() => this.goToTransactionList()}>Cancel</button>
          {this.state.transactionId && (
            <button onClick={() => this.deleteTransaction()}>Delete</button>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(TransactionForm);
