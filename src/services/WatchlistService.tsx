import axios from 'axios';
import WatchedSymbol from '../models/WatchedSymbol';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class WatchlistService {

  getWatchedSymbols() {
    return axios.get(serviceUrl + '/api/watching', {
        cancelToken: source.token
    });
  }

  postWatchedSymbol(watchedSymbol: WatchedSymbol) {
    return axios.post(serviceUrl + '/api/watching?symbol=' + watchedSymbol, {
      cancelToken: source.token
    });
  }

  deleteWatchedSymbol(watchedSymbol: WatchedSymbol) {
    return axios.delete(serviceUrl + '/api/watching?symbol=' + watchedSymbol, {
      cancelToken: source.token
    });
  }

  cancelRequest() {
    if (source) {
      source.cancel("Cancelling request.");
    }
  }
}

export default WatchlistService;
