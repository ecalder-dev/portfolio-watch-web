import axios, { AxiosResponse } from 'axios';
import CostBasis from '../models/CostBasis';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

const getCostBasis = (): Promise<AxiosResponse<Array<CostBasis>>>  => {
  return axios.get(serviceUrl + '/api/portfolio/cost-basis', {
      cancelToken: source.token
  });
}

const getOwnedSymbols = (): Promise<AxiosResponse<Array<string>>> => {
  return axios.get(serviceUrl + '/api/portfolio/owned', {
      cancelToken: source.token
  });
}

const portfolioService = {
  getCostBasis,
  getOwnedSymbols
}

export default portfolioService;
