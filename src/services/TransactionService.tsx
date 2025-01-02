import axios, { AxiosResponse } from 'axios';
import Transaction from '../models/Transaction';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl + '/api/transactions';

const getTransactions = (): Promise<AxiosResponse<Array<Transaction>>> => {
  return axios.get(serviceUrl, {
    cancelToken: source.token,
  });
};

const getTransaction = (id: number): Promise<AxiosResponse<Transaction>> => {
  return axios.get(serviceUrl + '/' + id, {
    cancelToken: source.token,
  });
};

const putTransaction = (
  transaction: Transaction,
): Promise<AxiosResponse<Transaction>> => {
  return axios.put(serviceUrl, transaction, {
    cancelToken: source.token,
  });
};

const postTransaction = (
  transaction: Transaction,
): Promise<AxiosResponse<Transaction>> => {
  return axios.post(serviceUrl, transaction, {
    cancelToken: source.token,
  });
};

const deleteTransaction = (id: string): Promise<AxiosResponse<void>> => {
  return axios.delete(serviceUrl + '/' + id, {
    cancelToken: source.token,
  });
};

const transactionService = {
  getTransactions,
  getTransaction,
  putTransaction,
  postTransaction,
  deleteTransaction,
};

export default transactionService;
