import axios, { AxiosResponse } from 'axios';
import QuoteDto from '../models/QuoteDto';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl + '/api/quotes';

const getQuote = (quote: string) : Promise<AxiosResponse<QuoteDto>> => {
  return axios.get(serviceUrl + '/' + quote, {
      cancelToken: source.token
  });
}

const getQuotes = (quotes: Array<string>) : Promise<AxiosResponse<Array<QuoteDto>>>  => {
  return axios.get(serviceUrl + '?symbols=' + quotes.join(','), {
      cancelToken: source.token
  });
}

const getIndices = () => {
  return axios.get(serviceUrl + '/indices', {
      cancelToken: source.token
  });
}

const dashboardService = {
  getQuote,
  getQuotes,
  getIndices
}

export default dashboardService;