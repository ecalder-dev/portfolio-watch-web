import React from 'react';
import './Dashboard.css';
import DashboardService from '../../services/DashboardService';
import FMPService from '../../services/FMPService';
import Summary from '../../models/Summary';
import Index from '../../models/Index';
import News from '../../models/News';
import Formatter from '../../utils/Formatter';

interface State {
  summaries: Summary[];
  indices: Index[];
  news: News[];
  sortBy: string;
  sortDirection: string;
}

class Dashboard extends React.Component<any, State> {

  state: State;
  summaries: Summary[];
  indices: Index[];
  news: News[];
  dashboardService: DashboardService;
  fmpService: FMPService;

  constructor(props: any) {
    super(props);
    this.dashboardService = new DashboardService();
    this.fmpService = new FMPService();
    this.summaries = [];
    this.indices = [];
    this.news = [];
    this.state = {
      summaries: this.summaries,
      indices: this.indices,
      news: this.news,
      sortBy: null,
      sortDirection: null
    };
  }

  goToUrl(url: string) {
    console.log(url);
  }

  componentDidMount() {
    this.dashboardService.getSummaries()
    .then(json => {
      this.summaries = json.data;
      this.summaries.sort(function(a, b) {
        if (a.percentChange > b.percentChange) return -1;
        if (b.percentChange > a.percentChange) return 1;
        return 0;
      });
      this.setState({ summaries: this.summaries });

      let symbols = this.summaries.map(summary => summary.symbol);
      this.fmpService.getNews(symbols)
      .then(json => {
        this.news = json.data;
        this.news.sort(function(a, b) {
          if (a.publishedDate > b.publishedDate) return -1;
          if (b.publishedDate > a.publishedDate) return 1;
          return 0;
        });
        this.setState({ news: this.news });
      })
      .catch(err => {
        console.log(err.message);
      });

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
    this.summaries = this.state.summaries;

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
                <span className="IndexStatsPercChange">
                  ({marketIndex.percentChange}%)
                </span>
              </div>
            </div>
          )}
          </div>
          <div className="Summaries">
            <div className="Positions">
              <h3>Positions</h3>
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
                  { this.summaries != null
                      && this.summaries.map((summary: Summary, index: number) =>
                    <tr className="Dashboard-tr" key={'summary' + index}>
                      <td className="Dashboard-td">{summary.symbol}</td>
                      <td className="Dashboard-td">{Formatter.formatDollar(summary.currentPrice)}</td>
                      <td className="Dashboard-td">{Formatter.formatPerc(summary.percentChange)}</td>
                      <td className="Dashboard-td">{Formatter.formatNumber(summary.averageVolume)}</td>
                      <td className="Dashboard-td">{summary.sector}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="News">
              <h3>News Feed</h3>
              <div className="NewsContent">
              { this.news != null
                  && this.news.map((newsItem: News, index: number) =>
                <div className="NewsItem" key={'newsItem' + index}>
                  <div className="NewsTitle">
                    <a href={newsItem.url} target="_blank">
                      {newsItem.title}
                    </a>
                  </div>
                  <div className="NewsDate">
                    {Formatter.formatDatetime(newsItem.publishedDate)}
                  </div>
                  <div className="NewsText">
                    {newsItem.text}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
