import axios from 'axios';
import Account from '../models/Account';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class AccountService {

  getAccounts(withDetails: boolean) {
    return axios.get(serviceUrl + '/api/accounts?withDetails=' + withDetails, {
        cancelToken: source.token
    });
  }

  putAccount(account: Account) {
    return axios.put(serviceUrl + '/api/account', account, {
      cancelToken: source.token
    });
  }

  postAccount(account: Account) {
    return axios.post(serviceUrl + '/api/account', account, {
      cancelToken: source.token
    });
  }

  deleteAccount(account: Account) {
    return axios.delete(serviceUrl + '/api/account', {data: account,
      cancelToken: source.token
    });
  }

  cancelRequest() {
    if (source) {
      source.cancel("Cancelling request.");
    }
  }
}

export default AccountService;
