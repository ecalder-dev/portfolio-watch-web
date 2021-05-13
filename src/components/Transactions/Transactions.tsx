import React from 'react';
import './Transactions.css';
import Transaction from '../../models/Transaction';
import TransactionService from '../../services/TransactionService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface State<T> {
  data: T[];
  done: boolean;
  rowsInEdit: Map<number, T>;
  newTransaction: T;
}

let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class Transactions extends React.Component<any, State<Transaction>> {

  state: State<Transaction>;
  rowsInEdit: Map<number, Transaction>;
  transactions: Transaction[];
  transactionService: TransactionService;
  typeList: string[];

  constructor(props: any) {
    super(props);
    this.rowsInEdit = new Map<number, Transaction>();
    this.transactionService = new TransactionService();
    this.transactions = [];
    this.typeList = ['BUY', 'SELL', 'TRANSFER', 'GIFT'];
    this.state = {
      data: this.transactions,
      done: false,
      rowsInEdit: this.rowsInEdit,
      newTransaction: null
    };
  }

  componentDidMount() {
    this.transactionService.getTransactions()
    .then(json => {
      this.transactions = json.data;
      this.setState({ data: this.transactions, done: true });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  componentWillUnmount() {
    //this.transactionService.cancelRequest();
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

  goToAddNew() {
    this.props.history.push('/transactions/form');
  }

  goToEdit(id: number) {
    this.props.history.push('/transactions/form/' + id);
  }

  render() {
    let transactions = null;
    let newTransaction = this.state.newTransaction;
    if (this.state.done) {
      transactions = this.state.data;
    }

    return (
      <div className="Transactions">
        <div className="Transactions-body">
          <h1 className="title">Here are your transactions.</h1>
          <p>You can add, update and remove your transactions here.</p>
          <button className="align-right" onClick={() => this.goToAddNew()}>Add New</button>
          <table className="Transaction-table">
            <thead>
              <tr className="Transaction-tr">
                <th className="Transaction-th">Type</th>
                <th className="Transaction-th">Symbol</th>
                <th className="Transaction-th">Shares</th>
                <th className="Transaction-th">Price</th>
                <th className="Transaction-th">Date Transacted</th>
                <th className="Transaction-th">Date Settled</th>
              </tr>
            </thead>
            <tbody>
              { transactions != null && transactions.map((transaction: Transaction, index: number) =>
                (<tr className="Transaction-tr" key={transaction.transactionId}
                onClick={() => this.goToEdit(transaction.transactionId)}>
                  <td className="Transaction-td">{transaction.type}</td>
                  <td className="Transaction-td">{transaction.symbol}</td>
                  <td className="Transaction-td">{transaction.shares}</td>
                  <td className="Transaction-td">{formatter.format(transaction.price)}</td>
                  <td className="Transaction-td">{this.getFormattedDateStr(transaction.dateTransacted)}</td>
                  <td className="Transaction-td">{this.getFormattedDateStr(transaction.dateSettled)}</td>
                </tr>))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Transactions;
