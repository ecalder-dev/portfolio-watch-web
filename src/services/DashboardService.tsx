import axios from 'axios';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class DashboardService {

  getQuotes() {
    return axios.get(serviceUrl + '/api/dashboard/quotes', {
        cancelToken: source.token
    });
  }

  getIndices() {
    return axios.get(serviceUrl + '/api/dashboard/indices', {
        cancelToken: source.token
    });
  }

}

export default DashboardService;
