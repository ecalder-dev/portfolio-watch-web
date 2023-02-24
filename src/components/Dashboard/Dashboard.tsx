import { useEffect, useState } from 'react';
import './Dashboard.css';
import Index from '../../models/Index';
import dashboardService from '../../services/DashboardService';
import IndexCard from './IndexCard';
import QuotesTable from './QuotesTable';
import portfolioService from '../../services/PortfolioService';
import watchlistService from '../../services/WatchlistService';

const Dashboard = () => {
  const [symbols, setSymbols] = useState([])
  const [quoteDtos, setQuoteDtos] = useState([]);
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    let temp = [];
    let oneDone = false;
    portfolioService.getOwnedSymbols()
      .then(response => {
        temp.push([...response.data]);
        if (oneDone && isSubscribed) {
          setSymbols(temp);
        } else {
          oneDone = true;
        }
      })
      .catch(err => {
        console.error(err);
        if (!oneDone) {
          oneDone = true;
        }
      });
    watchlistService.getWatchedSymbols()
      .then(response => {
        temp.push([...response.data.map(watched => watched.symbol)]);
        if (oneDone && isSubscribed) {
          setSymbols(temp);
        } else {
          oneDone = true;
        }
      })
      .catch(err => {
        console.error(err);
        if (!oneDone) {
          oneDone = true;
        }
      });
    return () => { isSubscribed = false };
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (symbols.length > 0) {
      dashboardService.getQuotes(symbols)
        .then(json => {
          const temp = json.data;
          temp.sort(function (a, b) {
            if (a.percentChange > b.percentChange) return -1;
            if (b.percentChange > a.percentChange) return 1;
            return 0;
          });
          if (isSubscribed) setQuoteDtos(temp);
        })
        .catch(err => {
          console.log(err.message);
        });

      dashboardService.getIndices()
        .then(json => {
          if (isSubscribed) setIndices(json.data);

        })
        .catch(err => {
          console.log(err.message);
        });
    }
    return () => { isSubscribed = false };
  }, [symbols]);

  return (
    <div className="Dashboard">
      <div className="Dashboard-body">
        <div className="Indices">
          {indices != null
            && indices.map((marketIndex: Index, index: number) =>
              <IndexCard marketIndex={marketIndex} key={'index' + index} />
            )}
        </div>
        <div className="Summaries">
          <div className="Positions">
            <h3>Watching</h3>
            <QuotesTable quoteDtos={quoteDtos} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
