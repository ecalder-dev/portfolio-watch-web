import axios from 'axios';
import WatchedSymbol from '../models/WatchedSymbol';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

const getWatchedSymbols = () => {
  return axios.get(serviceUrl + '/api/watching', {
      cancelToken: source.token
  });
}

const postWatchedSymbol = (watchedSymbol: WatchedSymbol) => {
  return axios.post(serviceUrl + '/api/watching?symbol=' + watchedSymbol, {
    cancelToken: source.token
  });
}

const deleteWatchedSymbol = (watchedSymbol: WatchedSymbol) => {
  return axios.delete(serviceUrl + '/api/watching?symbol=' + watchedSymbol, {
    cancelToken: source.token
  });
}

const watchlistService = {
  getWatchedSymbols,
  postWatchedSymbol,
  deleteWatchedSymbol
}

export default watchlistService;
