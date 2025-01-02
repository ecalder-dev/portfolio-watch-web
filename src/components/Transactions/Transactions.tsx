import { ReactElement, useEffect, useState } from 'react';
import './Transactions.css';
import Transaction from '../../models/Transaction';
import 'react-datepicker/dist/react-datepicker.css';
import formatter from '../../utils/Formatter';
import transactionService from '../../services/TransactionService';
import { useHistory } from 'react-router-dom';
import TableView from '../Shared/TableView';
import Account from '../../models/Account';

export const getDescriptionOfType = (type: string): string => {
  switch (type) {
    case 'BUY':
      return 'Buy';
    case 'SELL':
      return 'Sell';
    case 'GIFT':
      return 'Gift';
    default:
      return null;
  }
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const history = useHistory();
  const columns = [
    {
      header: 'Type',
      accessor: 'type',
      render: (data) => getDescriptionOfType(data.type),
    },
    {
      header: 'Account',
      accessor: 'account',
      render: (data) => createAccountDisplay(data.account),
    },
    { header: 'Symbol', accessor: 'symbol' },
    {
      header: 'Shares',
      accessor: 'shares',
      render: (data) => formatter.formatNumber(data.shares),
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (data) => formatter.formatDollar(data.price),
    },
    { header: 'Date', accessor: 'dateTransacted' },
  ];

  const createAccountDisplay = (account: Account): ReactElement => {
    return (
      <span>{account.accountName + ' (' + account.accountNumber + ')'}</span>
    );
  };

  const goToAddNew = (): void => {
    history.push('/transactions/form');
  };

  const goToEdit = (id: number): void => {
    history.push('/transactions/form/' + id);
  };

  useEffect(() => {
    let isSubscribed = true;
    transactionService
      .getTransactions()
      .then((json) => {
        const temp = json.data;
        temp.sort(function (a, b) {
          if (a.dateTransacted > b.dateTransacted) return -1;
          if (b.dateTransacted > a.dateTransacted) return 1;
          return 0;
        });
        if (isSubscribed) setTransactions(temp);
      })
      .catch((err) => {
        setTransactions([]);
        console.log(err.message);
      });
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="Transactions">
      <div className="Transactions-body">
        <h1 className="title">Transactions.</h1>
        <div className="TransactionsAddNew">
          <button onClick={() => goToAddNew()}>New</button>
        </div>
        <TableView
          columns={columns}
          data={transactions}
          onRowClick={(transaction) => goToEdit(transaction.id)}
        />
      </div>
    </div>
  );
};

export default Transactions;
