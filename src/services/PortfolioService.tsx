import axios, { AxiosResponse } from 'axios';
import CostBasis from '../models/CostBasis';
import config from '../resources/config.json';
import AggregatedAnnualSaleDto from '../models/AggregatedAnnualSale';
import LotSaleDto from '../models/LotSaleDto';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl + '/api/lots';

const getCostBasis = (): Promise<AxiosResponse<Array<CostBasis>>> => {
  return axios.get(serviceUrl + '/cost-basis', {
    cancelToken: source.token,
  });
};

const getOwnedSymbols = (): Promise<AxiosResponse<Array<string>>> => {
  return axios.get(serviceUrl + '/owned', {
    cancelToken: source.token,
  });
};

const getAvailableTaxYears = (): Promise<AxiosResponse<Array<number>>> => {
  return axios.get(serviceUrl + '/sales/tax-years', {
    cancelToken: source.token,
  });
};

const getSalesByTaxYear = (
  taxYear: string,
): Promise<AxiosResponse<Array<LotSaleDto>>> => {
  return axios.get(serviceUrl + '/sales/' + taxYear, {
    cancelToken: source.token,
  });
};

const getAggregatedSalesByTaxYear = (
  taxYear: number,
): Promise<AxiosResponse<any>> => {
  return axios.get(serviceUrl + '/sales/aggregate/' + taxYear, {
    cancelToken: source.token,
  });
};

const getAllAggregatedSales = (): Promise<
  AxiosResponse<Map<string, AggregatedAnnualSaleDto>>
> => {
  return axios.get(serviceUrl + '/sales/aggregate', {
    cancelToken: source.token,
  });
};

const portfolioService = {
  getCostBasis,
  getOwnedSymbols,
  getAvailableTaxYears,
  getSalesByTaxYear,
  getAggregatedSalesByTaxYear,
  getAllAggregatedSales,
};

export default portfolioService;
