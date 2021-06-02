import React from 'react';
import './Accounts.css';
import Account from '../../models/Account';
import AccountService from '../../services/AccountService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface State<T> {
  data: T[];
  done: boolean;
  rowsInEdit: Map<number, T>;
  newAccount: T;
}

class Accounts extends React.Component<any, State<Account>> {

  state: State<Account>;
  rowsInEdit: Map<number, Account>;
  accounts: Account[];
  accountService: AccountService;

  constructor(props: any) {
    super(props);
    this.rowsInEdit = new Map<number, Account>();
    this.accountService = new AccountService();
    this.accounts = [];
    this.state = {
      data: this.accounts,
      done: false,
      rowsInEdit: this.rowsInEdit,
      newAccount: null
    };
  }

  componentDidMount() {
    this.accountService.getAccounts(false)
    .then(json => {
      this.accounts = json.data;
      this.setState({ data: this.accounts, done: true });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  componentWillUnmount() {
    //this.accountService.cancelRequest();
  }

  editRow(account: Account) {
    let tempAccount = Object.assign({}, account);
    this.state.rowsInEdit.set(tempAccount.accountId, tempAccount);
    this.setState({ rowsInEdit: this.rowsInEdit });
  }

  cancelEditedRow(account: Account) {
    this.rowsInEdit.delete(account.accountId);
    this.setState({ rowsInEdit: this.rowsInEdit });
  }

  saveEditedRow(account: Account) {
    let tempAccount = this.rowsInEdit.get(account.accountId);
    account.accountId = tempAccount.accountId;
    account.accountName = tempAccount.accountName;
    account.accountNumber = tempAccount.accountNumber;
    account.dateOpened = tempAccount.dateOpened;
    this.accountService.putAccount(account)
    .then(json => {
      this.rowsInEdit.delete(account.accountId);
      this.setState({ rowsInEdit: this.rowsInEdit, done: true });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  deleteRow(account: Account) {
    if (window.confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(account)
      .then(json => {
        this.accounts = this.accounts.filter(p => p.accountId !== account.accountId);
        this.setState({ data: this.accounts, done: true });
      } )
      .catch(err => {
        console.log(err.message);
      });
    }
  }

  addNewRow() {
  　let newAccount = {
      accountId: 0,
      accountName: '',
      accountNumber: '',
      dateOpened: new Date(),
      datetimeInserted: null,
      datetimeUpdated: null
    }
    this.setState({newAccount: newAccount});
  }

  saveNewRow(account: Account) {
    this.accountService.postAccount(account).then(json => {
      if (json.data) {
        this.accounts.push(json.data);
        this.setState({ newAccount: null, done: true });
      }
    });
  }

  cancelNewRow(){
    this.setState({newAccount: null});
  }

  handleChange(e: any, oldData: Account) {
    if (e.target.value) {
      if (e.target.pattern && e.target.pattern.length > 0) {
        if (e.target.value.match(e.target.pattern)) {
          oldData[e.target.name] = e.target.value;
        }
      } else {
        oldData[e.target.name] = e.target.value;
      }
    } else {
      oldData[e.target.name] = '';
    }
    this.setState({ });
  }

  handleDateChange(date: any, oldData: Account, name: string) {
    if (date) {
      oldData[name] = date;
      this.setState({ });
    }
  }

  getEditObject(account: Account) {
    return this.state.rowsInEdit.get(account.accountId);
  }

  isInEdit(account: Account) {
    return this.state.rowsInEdit.has(account.accountId) === true;
  }

  getFormattedDateStr(date: Date) {
    if (date) {
      if (typeof date === 'number') {
        date = new Date(date);
      }
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else {
      return '';
    }
  }

  render() {
    let accounts = null;
    let newAccount = this.state.newAccount;
    if (this.state.done) {
      accounts = this.state.data;
    }

    return (
      <div className="Accounts">
        <div className="Accounts-body">
          <h1 className="title">Here are your accounts.</h1>
          <p>You can add, update and remove your accounts here.</p>
          <table className="Account-table">
            <thead>
              <tr className="Account-tr">
                <th className="Account-th">Account Name</th>
                <th className="Account-th">Account Number</th>
                <th className="Account-th">Date Opened</th>
              </tr>
            </thead>
            <tbody>
              { accounts != null && accounts.map((account: Account, index: number) =>
                !this.isInEdit(account) ?
                (<tr className="Account-tr" key={account.accountId}>
                  <td className="Account-td">{account.accountName}</td>
                  <td className="Account-td">{account.accountNumber}</td>
                  <td className="Account-td">{this.getFormattedDateStr(account.dateOpened)}</td>
                  <td className="Account-td">
                      <button onClick={() => this.editRow(account)}>Update</button>
                      <button onClick={() => this.deleteRow(account)}>Delete</button>
                  </td>
                </tr>) :
                (<tr className="Account-tr" key={account.accountId}>
                  <td className="Account-td">
                    <input type="text" value={this.getEditObject(account).accountName}
                    onChange={(e) => this.handleChange(e, this.getEditObject(account))} name="accountName"/>
                  </td>
                  <td className="Account-td">
                    <input type="text" value={this.getEditObject(account).accountNumber} onChange={(e) =>
                      this.handleChange(e, this.getEditObject(account))} name="accountNumber"/>
                  </td>
                  <td className="Account-td">
                  <DatePicker
                    selected={this.getEditObject(account).dateOpened}
                    onChange={date => this.handleDateChange(date, this.getEditObject(account), "dateOpened")}
                    dateFormat='M/d/yyyy'
                  />
                  </td>
                  <td className="Account-td">
                      <button onClick={() => this.saveEditedRow(account)}>Save</button>
                      <button onClick={() => this.cancelEditedRow(account)}>Cancel</button>
                  </td>
                </tr>)
              )}
              {newAccount != null ?
                <tr className="Account-tr" key={newAccount.accountId}>
                  <td className="Account-td">
                    <input type="text" value={newAccount.accountName}
                    onChange={(e) => this.handleChange(e, newAccount)} name="accountName"/>
                  </td>
                  <td className="Account-td">
                    <input type="text" value={newAccount.accountNumber} onChange={(e) =>
                      this.handleChange(e, newAccount)} name="accountNumber"/>
                  </td>
                  <td className="Account-td">
                    <DatePicker
                      selected={newAccount.dateOpened}
                      onChange={date => this.handleDateChange(date, newAccount, "dateOpened")}
                      dateFormat='M/d/yyyy'
                    />
                  </td>
                  <td>
                    <button onClick={() => this.saveNewRow(newAccount)}>Save</button>
                    <button onClick={() => this.cancelNewRow()}>Cancel</button>
                  </td>
                </tr>
                :
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <button onClick={() => this.addNewRow()}>Add New</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Accounts;
