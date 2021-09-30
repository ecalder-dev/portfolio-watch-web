import React from 'react';
import './Dashboard.css';
import DashboardService from '../../services/DashboardService';
import FMPService from '../../services/FMPService';
import QuoteDto from '../../models/QuoteDto';
import Index from '../../models/Index';
import News from '../../models/News';
import Formatter from '../../utils/Formatter';

interface State {
  quoteDtos: QuoteDto[];
  indices: Index[];
  sortBy: string;
  sortDirection: string;
}

class Dashboard extends React.Component<any, State> {

  state: State;
  quoteDtos: QuoteDto[];
  indices: Index[];
  dashboardService: DashboardService;
  fmpService: FMPService;

  constructor(props: any) {
    super(props);
    this.dashboardService = new DashboardService();
    this.fmpService = new FMPService();
    this.quoteDtos = [];
    this.indices = [];
    this.state = {
      quoteDtos: this.quoteDtos,
      indices: this.indices,
      sortBy: null,
      sortDirection: null
    };
  }

  componentDidMount() {
    this.dashboardService.getQuotes()
    .then(json => {
      this.quoteDtos = json.data;
      this.quoteDtos.sort(function(a, b) {
        if (a.percentChange > b.percentChange) return -1;
        if (b.percentChange > a.percentChange) return 1;
        return 0;
      });
      this.setState({ quoteDtos: this.quoteDtos });
    })
    .catch(err => {
      console.log(err.message);
    });

    this.dashboardService.getIndices()
    .then(json => {
      this.indices = json.data;
      this.setState({ indices: this.indices });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  componentWillUnmount() {
  }

  render() {
    this.quoteDtos = this.state.quoteDtos;
    return (
      <div className="Dashboard">
        <div className="Dashboard-body">
          <div className="Indices">
          { this.indices != null
              && this.indices.map((marketIndex: Index, index: number) =>
            <div className="IndexCard" key={'index' + index}>
              <div className="IndexName">
                {marketIndex.ticker}
              </div>
              <div className="IndexStats">
                <span className="IndexStatsLastPrice">
                  {Formatter.formatNumber(marketIndex.lastPrice)}
                </span>
                <span className={`IndexStatsPercChange ${marketIndex.percentChange >= 0 ? "Green": "Red"}`}>
                  {marketIndex.percentChange} %
                </span>
              </div>
            </div>
          )}
          </div>
          <div className="Summaries">
            <div className="Positions">
              <h3>Watching</h3>
              <table className="Dashboard-table">
                <thead>
                  <tr className="Dashboard-tr">
                    <th className="Dashboard-th symbol">Symbol</th>
                    <th className="Dashboard-th price">Current Price</th>
                    <th className="Dashboard-th percent">Changes %</th>
                    <th className="Dashboard-th volume">Volume</th>
                    <th className="Dashboard-th sector">Sector</th>
                  </tr>
                </thead>
                <tbody>
                  { this.quoteDtos != null
                      && this.quoteDtos.map((quoteDto: QuoteDto, index: number) =>
                    <tr className="Dashboard-tr" key={'quoteDto' + index}>
                      <td className="Dashboard-td symbol">
                        {quoteDto.symbol}
                      </td>
                      <td className="Dashboard-td price">
                        {Formatter.formatDollar(quoteDto.currentPrice)}
                      </td>
                      <td className={`Dashboard-td percent ${quoteDto.percentChange >= 0 ? "Green": "Red"}`}>
                        {Formatter.formatPerc(quoteDto.percentChange / 100)}
                      </td>
                      <td className="Dashboard-td volume">
                        {Formatter.formatNumber(quoteDto.averageVolume)}
                      </td>
                      <td className="Dashboard-td sector">
                        {quoteDto.sector}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
