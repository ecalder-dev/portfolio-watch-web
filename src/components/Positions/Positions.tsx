import React from 'react';
import './Positions.css';
import Position from '../../models/Position';
import PositionService from '../../services/PositionService';

interface State<T> {
  data: T[];
  done: boolean;
  rowsInEdit: Map<number, T>;
  newPosition: T;
}

let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class Positions extends React.Component<any, State<Position>> {

  state: State<Position>;
  rowsInEdit: Map<number, Position>;
  positions: Position[];
  positionService: PositionService;

  constructor(props: any) {
    super(props);
    this.rowsInEdit = new Map<number, Position>();
    this.positionService = new PositionService();
    this.positions = [];
    this.state = {
      data: this.positions,
      done: false,
      rowsInEdit: this.rowsInEdit,
      newPosition: null
    };
  }

  componentDidMount() {
    this.positionService.getPositions()
    .then(json => {
      this.positions = json.data;
      this.setState({ data: this.positions, done: true });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  componentWillUnmount() {
    //this.positionService.cancelRequest();
  }

  editRow(position: Position) {
    let tempPosition = Object.assign({}, position);
    this.state.rowsInEdit.set(tempPosition.positionId, tempPosition);
    this.setState({ rowsInEdit: this.rowsInEdit });
  }

  cancelEditedRow(position: Position) {
    this.rowsInEdit.delete(position.positionId);
    this.setState({ rowsInEdit: this.rowsInEdit });
  }

  saveEditedRow(position: Position) {
    let tempPosition = this.rowsInEdit.get(position.positionId);
    position.costBasis = tempPosition.costBasis;
    position.shares = tempPosition.shares;
    position.symbol = tempPosition.symbol;
    this.positionService.putPosition(position)
    .then(json => {
      this.rowsInEdit.delete(position.positionId);
      this.setState({ rowsInEdit: this.rowsInEdit, done: true });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  deleteRow(position: Position) {
    if (window.confirm('Are you sure you want to delete this position?')) {
      this.positionService.deletePosition(position)
      .then(json => {
        this.positions = this.positions.filter(p => p.positionId !== position.positionId);
        this.setState({ data: this.positions, done: true });
      } )
      .catch(err => {
        console.log(err.message);
      });
    }
  }

  addNewRow() {
  　let newPosition = {
      positionId: 0,
      costBasis: 0,
      shares: 0,
      symbol: ''
    }
    this.setState({newPosition: newPosition});
  }

  saveNewRow(position: Position) {
    this.positionService.postPosition(position).then(json => {
      if (json.data) {
        this.positions.push(json.data);
        this.setState({ newPosition: null, done: true });
      }
    });
  }

  cancelNewRow(){
    this.setState({newPosition: null});
  }

  handleChange(e: any, oldData: Position) {
    if (e.target.value) {
      if (e.target.pattern && e.target.pattern.length > 0) {
        if (e.target.value.match(e.target.pattern)) {
          oldData[e.target.name] = e.target.value;
        }
      } else {
        oldData[e.target.name] = e.target.value;
      }
    } else {
      oldData[e.target.name] = "";
    }
    this.setState({ });
  }

  getEditObject(position: Position) {
    return this.state.rowsInEdit.get(position.positionId);
  }

  isInEdit(position: Position) {
    return this.state.rowsInEdit.has(position.positionId) === true;
  }

  render() {
    let positions = null;
    let newPosition = this.state.newPosition;
    if (this.state.done) {
      positions = this.state.data;
    }

    return (
      <div className="Positions">
        <div className="Positions-body">
          <h1 className="title">Here are your positions.</h1>
          <p>You can add, update and remove your positions here.</p>
          <table className="Position-table">
            <thead>
              <tr className="Position-tr">
                <th className="Position-th">Symbol</th>
                <th className="Position-th">Shares</th>
                <th className="Position-th">Cost Basis</th>
                <th className="Position-th">Total Price</th>
              </tr>
            </thead>
            <tbody>
              { positions != null && positions.map((position: Position, index: number) =>
                !this.isInEdit(position) ?
                (<tr className="Position-tr" key={position.positionId}>
                  <td className="Position-td">{position.symbol}</td>
                  <td className="Position-td">{position.shares}</td>
                  <td className="Position-td">{formatter.format(position.costBasis)}</td>
                  <td className="Position-td">{formatter.format(position.shares * position.costBasis)}</td>
                  <td className="Position-td">
                      <button onClick={() => this.editRow(position)}>Update</button>
                      <button onClick={() => this.deleteRow(position)}>Delete</button>
                  </td>
                </tr>) :
                (<tr className="Position-tr" key={position.positionId}>
                  <td className="Position-td">
                    <input type="text" value={this.getEditObject(position).symbol}
                    onChange={(e) => this.handleChange(e, this.getEditObject(position))} name="symbol"/>
                  </td>
                  <td className="Position-td">
                    <input type="text" value={this.getEditObject(position).shares} onChange={(e) =>
                      this.handleChange(e, this.getEditObject(position))} name="shares" pattern="^\d*(\.\d{0,5})?$"/>
                  </td>
                  <td className="Position-td">
                    <input type="text" value={this.getEditObject(position).costBasis} onChange={(e) =>
                      this.handleChange(e, this.getEditObject(position))} name="costBasis" pattern="^\d*(\.\d{0,5})?$"/>
                  </td>
                  <td>
                  </td>
                  <td className="Position-td">
                      <button onClick={() => this.saveEditedRow(position)}>Save</button>
                      <button onClick={() => this.cancelEditedRow(position)}>Cancel</button>
                  </td>
                </tr>)
              )}
              {newPosition != null ?
                <tr className="Position-tr" key={newPosition.positionId}>
                  <td className="Position-td">
                    <input type="text" value={newPosition.symbol}
                    onChange={(e) => this.handleChange(e, newPosition)} name="symbol"/>
                  </td>
                  <td className="Position-td">
                    <input type="text" value={newPosition.shares} onChange={(e) =>
                      this.handleChange(e, newPosition)} name="shares" pattern="^\d*(\.\d{0,5})?$"/>
                  </td>
                  <td className="Position-td">
                    <input type="text" value={newPosition.costBasis} onChange={(e) =>
                      this.handleChange(e, newPosition)} name="costBasis" pattern="^\d*(\.\d{0,5})?$"/>
                  </td>
                  <td>
                    <button onClick={() => this.saveNewRow(newPosition)}>Save</button>
                    <button onClick={() => this.cancelNewRow()}>Cancel</button>
                  </td>
                </tr>
                :
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <button onClick={() => this.addNewRow()}>Add New</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Positions;
