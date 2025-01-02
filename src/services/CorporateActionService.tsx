import axios, { AxiosResponse } from 'axios';
import CorporateAction from '../models/CorporateAction';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl + '/api/corporate-actions';

const getCorporateActions = (): Promise<
  AxiosResponse<Array<CorporateAction>>
> => {
  return axios.get(serviceUrl, {
    cancelToken: source.token,
  });
};

const getCorporateAction = (
  id: number,
): Promise<AxiosResponse<CorporateAction>> => {
  return axios.get(serviceUrl + '/' + id, {
    cancelToken: source.token,
  });
};

const putCorporateAction = (
  corporateAction: CorporateAction,
): Promise<AxiosResponse<CorporateAction>> => {
  return axios.put(serviceUrl, corporateAction, {
    cancelToken: source.token,
  });
};

const postCorporateAction = (
  corporateAction: CorporateAction,
): Promise<AxiosResponse<CorporateAction>> => {
  return axios.post(serviceUrl, corporateAction, {
    cancelToken: source.token,
  });
};

const deleteCorporateAction = (id: string): Promise<AxiosResponse<void>> => {
  return axios.delete(serviceUrl + '/' + id, {
    cancelToken: source.token,
  });
};

const corporateActionService = {
  getCorporateActions,
  getCorporateAction,
  putCorporateAction,
  postCorporateAction,
  deleteCorporateAction,
};

export default corporateActionService;
