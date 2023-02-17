import { useEffect, useState } from "react";
import "./TransactionForm.css";
import Transaction from "../../../models/Transaction";
import Account from "../../../models/Account";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RouteComponentProps, useHistory, useParams, withRouter } from "react-router-dom";
import accountService from "../../../services/AccountService";
import transactionService from "../../../services/TransactionService";

const typeList = ['B', 'S', 'TO', 'TI', 'M', 'G', 'SP'];

const getDescriptionOfType = (type: string) => {
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

const validateNewTransaction = (transaction: Transaction): boolean => {
  if (transaction.account) {
    alert('Account should be selected.');
    return false;
  } else if (transaction.symbol) {
    alert('Symbol should not be empty.');
    return false;
  } else if (transaction.shares || transaction.shares === 0) {
    alert('Shares should should not be empty or 0.');
    return false;
  } else if (transaction.dateTransacted) {
    alert('Transaction date should not be null.');
    return false;
  } else {
    return true;
  }
}

const TransactionForm = ({ }: RouteComponentProps<{ id?: string; }>) => {
  const { id } = useParams<{ id }>()
  const [transactionId, setTransactionId] = useState(undefined);
  const [type, setType] = useState(undefined);
  const [symbol, setSymbol] = useState('B');
  const [shares, setShares] = useState(0);
  const [price, setPrice] = useState(0);
  const [account, setAccount] = useState(undefined);
  const [dateTransacted, setDateTransacted] = useState(new Date());
  const [dateSettled, setDateSettled] = useState(undefined);
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
          let found = accountList.filter(acct => acct.accountId === valInt);
          setAccount(found.length > 0 ? found[0] : null)
          break;
        }
      }
    }
  }

  const handleSubmit = () => {
    let transaction: Transaction;
    transaction = {
      transactionId: transactionId,
      type: type,
      symbol: symbol,
      shares: shares,
      price: price,
      account: account,
      dateTransacted: dateTransacted,
      dateSettled: dateSettled,
      datetimeInserted: null,
      datetimeUpdated: null,
    };

    if (validateNewTransaction(transaction)) {
      return;
    }

    if (transaction.transactionId) {
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
    if (window.confirm('Are you sure you want to delete this account?')) {
      let transaction: Transaction;
      transaction = {
        transactionId: transactionId,
        type: type,
        symbol: symbol,
        shares: shares,
        price: price,
        account: account,
        dateTransacted: dateTransacted,
        dateSettled: dateSettled,
        datetimeInserted: null,
        datetimeUpdated: null,
      };
      transactionService.deleteTransaction(transaction)
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
    accountService
      .getAccounts()
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
        setAccountList(accountList);
        setAccount(accountList.length > 0 ? accountList[0] : null);
      })
      .catch((err) => {
        console.log(err.message);
      });
    if (id) {
      transactionService.getTransaction(id).then((json) => {
        if (json.data) {
          let transaction: Transaction = json.data;
          setTransactionId(transaction.transactionId);
          setType(transaction.type);
          setSymbol(transaction.symbol);
          setShares(transaction.shares);
          setPrice(transaction.price);
          setDateTransacted(transaction.dateTransacted);
          setDateSettled(transaction.dateSettled);
        } else {
          history.push('/transactions');
        }
      }).catch((err) => {
        console.log(err.message);
      });;
    }
  }, []);

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
              value={account ? account.accountId : null}
              id="select-account"
            >
              <option disabled value={-1}>
                Select an Account
              </option>
              {accountList.map(
                (account: Account, index: number) => (
                  <option key={index} value={account.accountId}>
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
          <div className="entry">
            <label>Date Settled</label>
            <DatePicker
              selected={dateSettled}
              onChange={(date) => setDateSettled(date as Date)}
              dateFormat="M/d/yyyy"
            />
          </div>
        </div>
      </form>
      <div className="entry-row">
        <button onClick={() => handleSubmit()}>Submit</button>
        <button onClick={() => { history.push('/transactions') }}>Cancel</button>
        {transactionId && (
          <button onClick={() => deleteTransaction()}>Delete</button>
        )}
      </div>
    </div>
  );
}

export default withRouter(TransactionForm);
