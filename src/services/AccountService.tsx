import axios, { AxiosResponse } from "axios";
import Account from "../models/Account";
import config from "../resources/config.json";

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl + "/api/accounts";

const getAccounts = (): Promise<AxiosResponse<Array<Account>>> => {
  return axios.get(serviceUrl, {
    cancelToken: source.token,
  });
};

const getVisibleAccountsOnly = (): Promise<AxiosResponse<Array<Account>>> => {
  return axios.get(serviceUrl + "?showHidden=false", {
    cancelToken: source.token,
  });
};

const putAccount = (account: Account): Promise<AxiosResponse<Account>> => {
  return axios.put(serviceUrl, account, {
    cancelToken: source.token,
  });
};

const postAccount = (account: Account): Promise<AxiosResponse<Account>> => {
  return axios.post(serviceUrl, account, {
    cancelToken: source.token,
  });
};

const deleteAccount = (id: number): Promise<AxiosResponse<void>> => {
  return axios.delete(serviceUrl + "/" + id);
};

const cancelRequest = () => {
  if (source) {
    source.cancel("Cancelling request.");
  }
};

const accountService = {
  getAccounts,
  getVisibleAccountsOnly,
  putAccount,
  postAccount,
  deleteAccount,
  cancelRequest,
};

export default accountService;
