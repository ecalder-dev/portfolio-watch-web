import axios from 'axios';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

const getQuote = (quote: string) => {
  return axios.get(serviceUrl + '/api/quote/' + quote, {
      cancelToken: source.token
  });
}

const getQuotes = (quotes: Array<string>) => {
  return axios.get(serviceUrl + '/api/quotes?symbols=' + quotes.join(','), {
      cancelToken: source.token
  });
}

const getIndices = () => {
  return axios.get(serviceUrl + '/api/indices', {
      cancelToken: source.token
  });
}

const dashboardService = {
  getQuote,
  getQuotes,
  getIndices
}

export default dashboardService;