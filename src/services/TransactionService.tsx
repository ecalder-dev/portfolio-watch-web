import axios from 'axios';
import Transaction from '../models/Transaction';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class TransactionService {

  getTransactions() {
    return axios.get(serviceUrl + '/api/transactions', {
        cancelToken: source.token
    });
  }

  getTransaction(id: number) {
    return axios.get(serviceUrl + '/api/transaction/' + id, {
        cancelToken: source.token
    });
  }

  putTransaction(transaction: Transaction) {
    return axios.put(serviceUrl + '/api/transaction', transaction, {
      cancelToken: source.token
    });
  }

  postTransaction(transaction: Transaction) {
    return axios.post(serviceUrl + '/api/transaction', transaction, {
      cancelToken: source.token
    });
  }

  deleteTransaction(transaction: Transaction) {
    return axios.delete(serviceUrl + '/api/transaction', {data: transaction,
      cancelToken: source.token
    });
  }

  cancelRequest() {
    if (source) {
      source.cancel("Cancelling request.");
    }
  }
}

export default TransactionService;
