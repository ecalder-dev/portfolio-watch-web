import axios from 'axios';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

const getCostBasis = () => {
  return axios.get(serviceUrl + '/api/portfolio/cost-basis', {
      cancelToken: source.token
  });
}

const portfolioService = {
  getCostBasis
}

export default portfolioService;
