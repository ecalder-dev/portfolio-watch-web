import axios from 'axios';
import Position from '../models/Position';
import config from '../resources/config.json';

let source = axios.CancelToken.source();
let serviceUrl = config.serviceUrl;

class PositionService {

  getPositions() {
    return axios.get(serviceUrl + '/api/positions', {
        cancelToken: source.token
    });
  }

  putPosition(position: Position) {
    return axios.put(serviceUrl + '/api/position', position, {
      cancelToken: source.token
    });
  }

  postPosition(position: Position) {
    return axios.post(serviceUrl + '/api/position', position, {
      cancelToken: source.token
    });
  }

  deletePosition(position: Position) {
    return axios.delete(serviceUrl + '/api/position', {data: position,
      cancelToken: source.token
    });
  }

  cancelRequest() {
    if (source) {
      source.cancel("Cancelling request.");
    }
  }
}

export default PositionService;
