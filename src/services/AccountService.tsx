import axios from 'axios';
import Account from '../models/Account';

let source = axios.CancelToken.source();

class AccountService {

  getAccounts() {
    return axios.get('https://localhost:9200/api/accounts', {
        cancelToken: source.token
    });
  }

  putAccount(account: Account) {
    return axios.put('https://localhost:9200/api/account', account, {
      cancelToken: source.token
    });
  }

  postAccount(account: Account) {
    return axios.post('https://localhost:9200/api/account', account, {
      cancelToken: source.token
    });
  }

  deleteAccount(account: Account) {
    return axios.delete('https://localhost:9200/api/account', {data: account,
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
