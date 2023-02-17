import axios from 'axios';
import Transaction from '../models/Transaction';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

const getTransactions = () => {
  return axios.get(serviceUrl + '/api/transactions', {
      cancelToken: source.token
  });
}

const getTransaction = (id: number) => {
  return axios.get(serviceUrl + '/api/transaction/' + id, {
      cancelToken: source.token
  });
}

const putTransaction = (transaction: Transaction) => {
  return axios.put(serviceUrl + '/api/transaction', transaction, {
    cancelToken: source.token
  });
}

const postTransaction = (transaction: Transaction) => {
  return axios.post(serviceUrl + '/api/transaction', transaction, {
    cancelToken: source.token
  });
}

const deleteTransaction = (transaction: Transaction) => {
  return axios.delete(serviceUrl + '/api/transaction', {data: transaction,
    cancelToken: source.token
  });
}

const transactionService = {
  getTransactions,
  getTransaction,
  putTransaction,
  postTransaction,
  deleteTransaction
}

export default transactionService;