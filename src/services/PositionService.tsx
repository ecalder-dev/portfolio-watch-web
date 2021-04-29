import axios from 'axios';
import Position from '../models/Position';

let source = axios.CancelToken.source();

class PositionService {

  getPositions() {
    return axios.get('https://localhost:9200/api/positions', {
        cancelToken: source.token
    });
  }

  putPosition(position: Position) {
    return axios.put('https://localhost:9200/api/position', position, {
      cancelToken: source.token
    });
  }

  postPostion(position: Position) {
    return axios.post('https://localhost:9200/api/position', position, {
      cancelToken: source.token
    });
  }

  deletePostion(position: Position) {
    return axios.delete('https://localhost:9200/api/position', {data: position,
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
