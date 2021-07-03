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
  news: News[];
  sortBy: string;
  sortDirection: string;
}

class Dashboard extends React.Component<any, State> {

  state: State;
  quoteDtos: QuoteDto[];
  indices: Index[];
  news: News[];
  dashboardService: DashboardService;
  fmpService: FMPService;
  newsDiv = React.createRef<HTMLDivElement>();
  selectedSymbol: string | null;

  constructor(props: any) {
    super(props);
    this.dashboardService = new DashboardService();
    this.fmpService = new FMPService();
    this.quoteDtos = [];
    this.indices = [];
    this.news = [];
    this.state = {
      quoteDtos: this.quoteDtos,
      indices: this.indices,
      news: this.news,
      sortBy: null,
      sortDirection: null
    };
  }

  filterNews(symbol: string) {
    if (this.selectedSymbol === symbol) {
      this.selectedSymbol = null;
      this.setState({ news: this.news });
    } else {
      let tempNews = this.news.filter(n => n.mentionedSymbols.includes(symbol));
      this.selectedSymbol = symbol;
      this.setState({ news: tempNews });
    }
    this.newsDiv.current.scrollIntoView({ behavior: 'smooth' });
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

      let symbols = this.quoteDtos.map(quoteDto => quoteDto.symbol);
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
    this.quoteDtos = this.state.quoteDtos;
    let news = this.state.news;
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
                  {marketIndex.percentChange}%
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
                  { this.quoteDtos != null
                      && this.quoteDtos.map((quoteDto: QuoteDto, index: number) =>
                    <tr className={`Dashboard-tr ${this.selectedSymbol === quoteDto.symbol ? "selected": ""}`}
                      key={'quoteDto' + index}
                      onClick={() => this.filterNews(quoteDto.symbol)}>
                      <td className="Dashboard-td">
                        {quoteDto.symbol}
                      </td>
                      <td className="Dashboard-td">
                        {Formatter.formatDollar(quoteDto.currentPrice)}
                      </td>
                      <td className={`Dashboard-td ${quoteDto.percentChange >= 0 ? "Green": "Red"}`}>
                        {Formatter.formatPerc(quoteDto.percentChange)}
                      </td>
                      <td className="Dashboard-td">
                        {Formatter.formatNumber(quoteDto.averageVolume)}
                      </td>
                      <td className="Dashboard-td">
                        {quoteDto.sector}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="News" ref={this.newsDiv}>
              <h3>News Feed</h3>
              <div className="NewsContent">
              { news != null
                  && news.map((newsItem: News, index: number) =>
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
                  <div className="NewsMentionedSymbols">
                    Mentioned: {newsItem.mentionedSymbols.join(', ')}
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
