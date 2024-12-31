import { useEffect, useState } from "react";
import "./TransferForm.css";
import Transfer from "../../../models/Transfer";
import Account from "../../../models/Account";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory, useParams, withRouter } from "react-router-dom";
import accountService from "../../../services/AccountService";
import transferService from "../../../services/TransferService";

const isValidNewTransfer = (transfer: Transfer): boolean => {
  if (!transfer.fromAccount) {
    alert("From account should be selected.");
    return false;
  } else if (!transfer.toAccount) {
    alert("To account should be selected.");
    return false;
  } else if (transfer.fromAccount.id === transfer.toAccount.id) {
    alert("To and From Account should not be the same.");
    return false;
  } else if (!transfer.symbol || transfer.symbol.length === 0) {
    alert("Symbol should not be empty.");
    return false;
  } else if (!transfer.shares || transfer.shares === 0) {
    alert("Shares should should not be empty or 0.");
    return false;
  } else if (!transfer.dateTransacted) {
    alert("Transfer date should not be null.");
    return false;
  } else {
    return true;
  }
};

const TransferForm = () => {
  const { id } = useParams<{ id }>();
  const [transferId, setTransferId] = useState(undefined);
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState(0);
  const [fromAccount, setFromAccount] = useState(undefined);
  const [toAccount, setToAccount] = useState(undefined);
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
        case "symbol": {
          setSymbol(value ? value.toUpperCase() : null);
          break;
        }
        case "shares": {
          setShares(value);
          break;
        }
        case "fromAccount": {
          let valInt = parseInt(value, 0);
          let found = accountList.filter((acct) => acct.id === valInt);
          setFromAccount(found.length > 0 ? found[0] : null);
          break;
        }
        case "toAccount": {
          let valInt = parseInt(value, 0);
          let found = accountList.filter((acct) => acct.id === valInt);
          setToAccount(found.length > 0 ? found[0] : null);
          break;
        }
      }
    }
  };

  const handleSubmit = () => {
    let transfer: Transfer;

    transfer = {
      id: transferId,
      symbol: symbol,
      shares: shares,
      dateTransacted: dateTransacted,
      fromAccount: fromAccount,
      toAccount: toAccount,
    };

    if (!isValidNewTransfer(transfer)) {
      return;
    }

    if (transfer.id) {
      transferService.putTransfer(transfer).then((json) => {
        if (json.data) {
          history.push("/transfers");
        }
      });
    } else {
      transferService.postTransfer(transfer).then((json) => {
        if (json.data) {
          history.push("/transfers");
        }
      });
    }
  };

  const deleteTransfer = () => {
    if (window.confirm("Are you sure you want to delete this transfer?")) {
      transferService
        .deleteTransfer(transferId)
        .then(() => {
          history.push("/transfers");
        })
        .catch((err) => {
          console.log(err.message);
          alert("Transfer was not deleted.");
        });
    }
  };

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
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (id && accountList && accountList.length > 0) {
      transferService
        .getTransfer(id)
        .then((json) => {
          if (json.data && isSubscribed) {
            let transfer: Transfer = json.data;
            setTransferId(transfer.id);
            setSymbol(transfer.symbol);
            setShares(transfer.shares);
            setDateTransacted(new Date(transfer.dateTransacted));
            setFromAccount(transfer.fromAccount);
            setToAccount(transfer.toAccount);
          } else {
            history.push("/transfers");
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    return () => {
      isSubscribed = false;
    };
  }, [id, accountList, history]);

  return (
    <div className="TransferForms">
      <h1 className="title">New Transfer</h1>
      <form>
        <div className="entry-row">
          <div className="entry">
            <label>From Account</label>
            <select
              name="fromAccount"
              onChange={(e) => handleInputChange(e)}
              value={fromAccount ? fromAccount.id : null}
              id="select-account"
            >
              <option disabled value={-1}>
                Select an Account
              </option>
              {accountList.map((account: Account, index: number) => (
                <option key={index} value={account.id}>
                  {account.accountName + " (" + account.accountNumber + ")"}
                </option>
              ))}
            </select>
          </div>
          <div className="entry">
            <label>To Account</label>
            <select
              name="toAccount"
              onChange={(e) => handleInputChange(e)}
              value={toAccount ? toAccount.id : null}
              id="select-account"
            >
              <option disabled value={-1}>
                Select an Account
              </option>
              {accountList.map((account: Account, index: number) => (
                <option key={index} value={account.id}>
                  {account.accountName + " (" + account.accountNumber + ")"}
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
            <label>Date Transacted</label>
            <DatePicker
              selected={dateTransacted}
              onChange={(date) => setDateTransacted(date as Date)}
              dateFormat="M/d/yyyy"
            />
          </div>
        </div>
      </form>
      <div className="entry-row">
        <button onClick={() => handleSubmit()}>Submit</button>
        <button
          onClick={() => {
            history.push("/transfers");
          }}
        >
          Cancel
        </button>
        {id && <button onClick={() => deleteTransfer()}>Delete</button>}
      </div>
    </div>
  );
};

export default withRouter(TransferForm);
