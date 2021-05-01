import axios from 'axios';

let source = axios.CancelToken.source();

class DashboardService {

  getSummaries() {
    return axios.get('https://localhost:9200/api/dashboard/summaries', {
        cancelToken: source.token
    });
  }
}

export default DashboardService;
