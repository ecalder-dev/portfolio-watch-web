import axios, { AxiosResponse } from 'axios';
import WatchedSymbol from '../models/WatchedSymbol';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

const getWatchedSymbols = () : Promise<AxiosResponse<Array<WatchedSymbol>>> => {
  return axios.get(serviceUrl + '/api/watch', {
      cancelToken: source.token
  });
}

const postWatchedSymbol = (watchedSymbol: WatchedSymbol) : Promise<AxiosResponse<Array<WatchedSymbol>>>  => {
  return axios.post(serviceUrl + '/api/watch?symbol=' + watchedSymbol, {
    cancelToken: source.token
  });
}

const deleteWatchedSymbol = (watchedSymbol: WatchedSymbol) : Promise<AxiosResponse<Array<void>>>  => {
  return axios.delete(serviceUrl + '/api/watch?symbol=' + watchedSymbol, {
    cancelToken: source.token
  });
}

const watchlistService = {
  getWatchedSymbols,
  postWatchedSymbol,
  deleteWatchedSymbol
}

export default watchlistService;
