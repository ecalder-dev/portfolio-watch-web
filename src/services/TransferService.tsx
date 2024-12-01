import axios, { AxiosResponse } from 'axios';
import Transfer from '../models/Transfer';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl + '/api/transfers';

const getTransfers = (): Promise<AxiosResponse<Array<Transfer>>> => {
  return axios.get(serviceUrl, {
    cancelToken: source.token
  });
}

const getTransfer = (id: number): Promise<AxiosResponse<Transfer>> => {
  return axios.get(serviceUrl + '/' + id, {
    cancelToken: source.token
  });
}

const putTransfer = (transfer: Transfer): Promise<AxiosResponse<Transfer>> => {
  return axios.put(serviceUrl, transfer, {
    cancelToken: source.token
  });
}

const postTransfer = (transfer: Transfer): Promise<AxiosResponse<Transfer>> => {
  return axios.post(serviceUrl, transfer, {
    cancelToken: source.token
  });
}

const deleteTransfer = (id: string): Promise<AxiosResponse<void>> => {
  return axios.delete(serviceUrl + '/' + id, {
    cancelToken: source.token
  });
}

const transferService = {
  getTransfers,
  getTransfer,
  putTransfer,
  postTransfer,
  deleteTransfer
}

export default transferService;