import axios from 'axios';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class DividendService {

  getDividendProfile(symbol: String) {
    return axios.get(serviceUrl + '/api/nasdaq/dividend-profile?symbol=' + symbol, {
      cancelToken: source.token
    });
  }

  getDividendProfiles(symbols: String[]) {
    return axios.get(serviceUrl + '/api/nasdaq/dividend-profiles?symbol=' + symbols, {
      cancelToken: source.token
    });
  }

}

export default DividendService;
