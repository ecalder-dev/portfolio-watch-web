import React from 'react';
import './Positions.css';
import axios from 'axios'

let source = axios.CancelToken.source();

interface IObjectKeys {
  [key: string]: string | number;
}

interface Response {
  data: Position[];
  error: String;
  status: number
}

interface Position extends IObjectKeys {
  costBasis: number;
  positionId: number;
  shares: number;
  symbol: string;
}

interface Props {
}

interface State {
  response: Response;
  done: boolean;
  rowsInEdit: Map<number, Position>;
}

class Positions extends React.Component<Props, State> {

  state: State;

  constructor(props: any) {
    super(props);
      this.state = {
          response: null,
          done: false,
          rowsInEdit: new Map<number, Position>()
      }
  }

  componentDidMount() {
      axios.get('https://localhost:9200/api/positions', {
          cancelToken: source.token
      }).then(json => this.setState({ response: json.data, done: true }))
  }

  componentWillUnmount() {
      if (source) {
      source.cancel("Landing Component got unmounted");
    }
  }

  editRow(position: Position) {
    let tempPosition = Object.assign({}, position);
    let rowsInEdit = this.state.rowsInEdit;
    rowsInEdit.set(tempPosition.positionId, tempPosition);
    this.setState({ rowsInEdit: rowsInEdit });
  }

  cancelRow(position: Position) {
    let rowsInEdit = this.state.rowsInEdit;
    rowsInEdit.delete(position.positionId);
    this.setState({ rowsInEdit: rowsInEdit });
  }

  handleChange(e: any, position: Position) {
    let tempPosition = this.state.rowsInEdit.get(position.positionId);
    if (e.target.value) {
      tempPosition[e.target.name] = e.target.value;
      this.setState({ });
    }
  }

  getEditObject(position: Position) {
    return this.state.rowsInEdit.get(position.positionId);
  }

  isInEdit(position: Position) {
    return this.state.rowsInEdit.has(position.positionId) === true;
  }

  render() {
    let positions = null;
    if (this.state.done) {
      positions = this.state.response.data;
    }

    return (
      <div className="Positions">
        <div className="Positions-body">
          <h1 className="title">Here are your positions.</h1>
          <p>You can add, update and remove your positions in here.</p>
          <div className="Position-table">
            <div className="Position-tr">
              <div className="Position-th">Symbol</div>
              <div className="Position-th">Shares</div>
              <div className="Position-th">Cost Basis</div>
            </div>
            { positions != null && positions.map((position: Position, index: number) =>
              !this.isInEdit(position) ?
              (<div className="Position-tr" key={position.positionId}>
                <div className="Position-td">{position.symbol}</div>
                <div className="Position-td">{position.shares}</div>
                <div className="Position-td">{position.costBasis}</div>
                <div className="Position-td">
                    <button onClick={() => this.editRow(position)}>Update</button>
                    <button>Delete</button>
                </div>
              </div>) :
              (<div className="Position-tr" key={position.positionId}>
                <div className="Position-td">
                  <input type="text" value={this.getEditObject(position).symbol}
                  onChange={(e) => this.handleChange(e, position)} name="symbol"/>
                </div>
                <div className="Position-td">
                  <input type="text" value={this.getEditObject(position).shares} onChange={(e) =>
                    this.handleChange(e, position)}  name="shares"/>
                </div>
                <div className="Position-td">
                  <input type="text" value={this.getEditObject(position).costBasis} onChange={(e) =>
                    this.handleChange(e, position)}  name="costBasis"/>
                </div>
                <div className="Position-td">
                    <button>Save</button>
                    <button onClick={() => this.cancelRow(position)}>Cancel</button>
                </div>
              </div>)
            )}
          </div>

        </div>
      </div>
    );
  }
}

export default Positions;
