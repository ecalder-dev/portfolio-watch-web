import axios from 'axios';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class FMPService {

  getNews(symbols: string[]) {
    return axios.get(serviceUrl + '/api/fmp/news?symbols=' + symbols, {
        cancelToken: source.token,
    });
  }
}

export default FMPService;
