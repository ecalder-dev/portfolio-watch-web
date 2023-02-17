import axios from 'axios';
import Account from '../models/Account';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

const getAccounts = () => {
  return axios.get(serviceUrl + '/api/accounts', {
      cancelToken: source.token
  });
}

const putAccount = (account: Account) => {
  return axios.put(serviceUrl + '/api/account', account, {
    cancelToken: source.token
  });
}

const postAccount = (account: Account) => {
  return axios.post(serviceUrl + '/api/account', account, {
    cancelToken: source.token
  });
}

const deleteAccount = (account: Account) => {
  return axios.delete(serviceUrl + '/api/account', {data: account,
    cancelToken: source.token
  });
}

const cancelRequest = () => {
  if (source) {
    source.cancel("Cancelling request.");
  }
}

const accountService = {
  getAccounts,
  putAccount,
  postAccount,
  deleteAccount,
  cancelRequest
}

export default accountService;
