import React from 'react';
import './Dashboard.css';
import DashboardService from '../../services/DashboardService';
import Summary from '../../models/Summary';

interface State {
  summaries: Summary[];
  done: boolean;
  sortBy: string;
  sortDirection: string;
}


let formatter = new Intl.NumberFormat('en-US');

let currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

let percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
class Dashboard extends React.Component<any, State> {

  state: State;
  summaries: Summary[];
  dashboardService: DashboardService;

  constructor(props: any) {
    super(props);
    this.dashboardService = new DashboardService();
    this.summaries = [];
    this.state = {
      summaries: this.summaries,
      done: false,
      sortBy: null,
      sortDirection: null
    };
  }

  componentDidMount() {
    this.dashboardService.getSummaries()
    .then(json => {
      this.summaries = json.data;
      this.summaries.sort(function(a, b) {
        if (a.percentChange > b.percentChange) return 1;
        if (b.percentChange > a.percentChange) return -1;
        return 0;
      });
      this.setState({ summaries: this.summaries, done: true });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  componentWillUnmount() {
  }

  render() {
    if (this.state.done) {
      this.summaries = this.state.summaries;
    }

    return (
      <div className="Dashboard">
        <div className="Dashboard-body">
          <h1 className="title">Dashboard</h1>
          <table className="Dashboard-table">
            <thead>
              <tr className="Dashboard-tr">
                <th className="Dashboard-th">Symbol</th>
                <th className="Dashboard-th">Current Price</th>
                <th className="Dashboard-th">Changes %</th>
                <th className="Dashboard-th">Volume</th>
                <th className="Dashboard-th">Sector</th>
              </tr>
            </thead>
            <tbody>
              { this.state.done && this.summaries != null
                  && this.summaries.map((summary: Summary, index: number) =>
                <tr className="Dashboard-tr" key={index}>
                  <td className="Dashboard-td">{summary.symbol}</td>
                  <td className="Dashboard-td">{currencyFormatter.format(summary.currentPrice)}</td>
                  <td className="Dashboard-td">{percentFormatter.format(summary.percentChange)}</td>
                  <td className="Dashboard-td">{formatter.format(summary.averageVolume)}</td>
                  <td className="Dashboard-td">{summary.sector}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Dashboard;
