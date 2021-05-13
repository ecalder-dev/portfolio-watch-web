import axios from 'axios';

let source = axios.CancelToken.source();
let serviceUrl = 'https://localhost:9200';

class DashboardService {

  getSummaries() {
    return axios.get(serviceUrl + '/api/dashboard/summaries', {
        cancelToken: source.token
    });
  }
}

export default DashboardService;
