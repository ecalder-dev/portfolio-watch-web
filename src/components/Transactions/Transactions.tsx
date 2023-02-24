import React, { useEffect, useState } from 'react';
import './Transactions.css';
import Transaction from '../../models/Transaction';
import 'react-datepicker/dist/react-datepicker.css';
import formatter from '../../utils/Formatter';
import transactionService from '../../services/TransactionService';
import { useHistory } from 'react-router-dom';

const getDescriptionOfType = (type: string): string => {
  switch (type) {
    case 'B':
      return 'Buy';
    case 'S':
      return 'Sell';
    case 'TO':
      return 'Transfer Out';
    case 'TI':
      return 'Transfer In';
    case 'M':
      return 'Merger';
    case 'G':
      return 'Gift';
    case 'SP':
      return 'Split';
    default:
      return type;
  }
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const history = useHistory();

  const goToAddNew = (): void => {
    history.push('/transactions/form');
  }

  const goToEdit = (id: number): void => {
    history.push('/transactions/form/' + id);
  }

  useEffect(() => {
    let isSubscribed = true;
    transactionService.getTransactions()
      .then(json => {
        const temp = json.data;
        temp.sort(function (a, b) {
          if (a.dateTransacted > b.dateTransacted) return -1;
          if (b.dateTransacted > a.dateTransacted) return 1;
          return 0;
        });
        if (isSubscribed) setTransactions(temp);
      })
      .catch(err => {
        setTransactions([]);
        console.log(err.message);
      });
    return () => { isSubscribed = false };
  }, []);

  return (
    <div className="Transactions">
      <div className="Transactions-body">
        <h1 className="title">Here are your transactions.</h1>
        <div className="TransactionsAddNew">
          <button onClick={() => goToAddNew()}>Add New Transaction</button>
        </div>
        <table className="Transaction-table">
          <thead>
            <tr className="Transaction-tr">
              <th className="Transaction-th">Type</th>
              <th className="Transaction-th account">Account</th>
              <th className="Transaction-th">Symbol</th>
              <th className="Transaction-th">Shares</th>
              <th className="Transaction-th">Price</th>
              <th className="Transaction-th dateTransacted">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions != null && transactions.map((transaction: Transaction, index: number) =>
            (<tr className="Transaction-tr" key={transaction.transactionId}
              onClick={() => goToEdit(transaction.transactionId)}>
              <td className="Transaction-td">{getDescriptionOfType(transaction.type)}</td>
              <td className="Transaction-td account">{transaction.account.accountName
                + ' (' + transaction.account.accountNumber + ')'}</td>
              <td className="Transaction-td">{transaction.symbol}</td>
              <td className="Transaction-td">{formatter.formatNumber(transaction.shares)}</td>
              <td className="Transaction-td">{formatter.formatDollar(transaction.price)}</td>
              <td className="Transaction-td dateTransacted">{formatter.formatDate(transaction.dateTransacted)}</td>
            </tr>))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
