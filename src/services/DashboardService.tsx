import axios from 'axios';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class DashboardService {

  getSummaries() {
    return axios.get(serviceUrl + '/api/dashboard/summaries', {
        cancelToken: source.token
    });
  }
}

export default DashboardService;
