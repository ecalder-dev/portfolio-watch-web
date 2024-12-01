import { useEffect, useState } from "react";
import "./TransactionForm.css";
import Transaction from "../../../models/Transaction";
import Account from "../../../models/Account";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory, useParams, withRouter } from "react-router-dom";
import accountService from "../../../services/AccountService";
import transactionService from "../../../services/TransactionService";
import { getDescriptionOfType } from "../Transactions";

const typeList = ['BUY', 'SELL', 'GIFT'];

const isValidNewTransaction = (transaction: Transaction): boolean => {
  if (!transaction.account) {
    alert('Account should be selected.');
    return false;
  } else if (!transaction.symbol || transaction.symbol.length === 0) {
    alert('Symbol should not be empty.');
    return false;
  } else if (!transaction.shares || transaction.shares === 0) {
    alert('Shares should should not be empty or 0.');
    return false;
  } else if (!transaction.dateTransacted) {
    alert('Transaction date should not be null.');
    return false;
  } else if (!transaction.type) {
    alert('Type should not be null.');
    return false;
  } else {
    return true;
  }
}

const TransactionForm = () => {
  const { id } = useParams<{ id }>()
  const [transactionId, setTransactionId] = useState(undefined);
  const [type, setType] = useState('BUY');
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState(0);
  const [price, setPrice] = useState(0);
  const [account, setAccount] = useState(undefined);
  const [dateTransacted, setDateTransacted] = useState(new Date());
  const [accountList, setAccountList] = useState([]);
  const history = useHistory();

  const handleInputChange = (e: any) => {
    let value = e.target.value;
    let pattern = e.target.pattern;
    let name = e.target.name;

    if (pattern && value && !value.match(pattern)) {
      return;
    } else {
      switch (name) {
        case 'symbol': {
          setSymbol(value ? value.toUpperCase() : null)
          break;
        }
        case 'shares': {
          setShares(value);
          break;
        }
        case 'price': {
          setPrice(value);
          break;
        }
        case 'account': {
          let valInt = parseInt(value, 0);
          let found = accountList.filter(acct => acct.id === valInt);
          setAccount(found.length > 0 ? found[0] : null)
          break;
        }
      }
    }
  }

  const handleSubmit = () => {
    let transaction: Transaction;

    transaction = {
      id: transactionId,
      price: price,
      symbol: symbol,
      shares: shares,
      dateTransacted: dateTransacted,
      type: type,
      account: account,
    };

    if (!isValidNewTransaction(transaction)) {
      return;
    }

    if (transaction.id) {
      transactionService.putTransaction(transaction).then((json) => {
        if (json.data) {
          history.push('/transactions');
        }
      });
    } else {
      transactionService.postTransaction(transaction).then((json) => {
        if (json.data) {
          history.push('/transactions');
        }
      });
    }
  }

  const deleteTransaction = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      transactionService.deleteTransaction(transactionId)
        .then(() => {
          history.push('/transactions');
        })
        .catch(err => {
          console.log(err.message);
          alert('Transaction was not deleted.')
        });
    }
  }

  useEffect(() => {
    let isSubscribed = true;
    accountService
      .getVisibleAccountsOnly()
      .then((json) => {
        let accountList = json.data;
        accountList.sort(function (a, b) {
          if (a.accountName > b.accountName) return -1;
          if (b.accountName > a.accountName) return 1;
          if (a.accountName === b.accountName) {
            if (a.accountNumber < b.accountNumber) return -1;
            if (b.accountNumber < a.accountNumber) return 1;
          }
          return 0;
        });
        if (isSubscribed) {
          setAccountList(accountList);
          setAccount(accountList.length > 0 ? accountList[0] : null);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
      return () => { isSubscribed = false };
  }, []);

  useEffect(() => {  
    let isSubscribed = true;
    if (id && accountList && accountList.length > 0) {
      transactionService.getTransaction(id).then((json) => {
        if (json.data && isSubscribed) {
          let transaction: Transaction = json.data;
          setTransactionId(transaction.id);
          setType(transaction.type);
          setSymbol(transaction.symbol);
          setShares(transaction.shares);
          setPrice(transaction.price);
          setDateTransacted(new Date(transaction.dateTransacted));
          setAccount(transaction.account);
        } else {
          history.push('/transactions');
        }
      }).catch((err) => {
        console.log(err.message);
      });
    }
    return () => { isSubscribed = false };
  }, [id, accountList, history]);

  return (
    <div className="TransactionForms">
      <h1 className="title">New Transaction</h1>
      <form>
        <div className="entry-row">
          <div className="entry">
            <label>Account</label>
            <select
              name="account"
              onChange={(e) => handleInputChange(e)}
              value={account ? account.id : ''}
              id="select-account"
            >
              <option disabled value={-1}>
                Select an Account
              </option>
              {accountList.map(
                (account: Account, index: number) => (
                  <option key={index} value={account.id}>
                    {account.accountName + ' (' + account.accountNumber + ')'}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="entry">
            <label>Type</label>
            <select
              name="type"
              onChange={e => setType(e.target.value)}
              value={type}
              id="select-type"
            >
              {typeList.map((type: string, index: number) => (
                <option key={"type-" + index} value={type}>
                  {getDescriptionOfType(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="entry-row">
          <div className="entry">
            <label>Symbol</label>
            <input
              value={symbol}
              name="symbol"
              pattern="^[A-z]{1,5}$"
              onInput={(e) => handleInputChange(e)}
            />
          </div>
          <div className="entry">
            <label>Shares</label>
            <input
              value={shares}
              pattern="^\d*(\.\d{0,10})?$"
              name="shares"
              onInput={(e) => handleInputChange(e)}
            />
          </div>
          <div className="entry">
            <label>Price</label>
            <input
              value={price}
              pattern="^\d*(\.\d{0,10})?$"
              name="price"
              onInput={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className="entry-row">
          <div className="entry">
            <label>Date Transacted</label>
            <DatePicker
              selected={dateTransacted}
              onChange={(date) =>
                setDateTransacted(date as Date)
              }
              dateFormat="M/d/yyyy"
            />
          </div>
        </div>
      </form>
      <div className="entry-row">
        <button onClick={() => handleSubmit()}>Submit</button>
        <button onClick={() => { history.push('/transactions') }}>Cancel</button>
        {id && (
          <button onClick={() => deleteTransaction()}>Delete</button>
        )}
      </div>
    </div>
  );
}

export default withRouter(TransactionForm);
