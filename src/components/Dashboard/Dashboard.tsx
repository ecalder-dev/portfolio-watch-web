import { useEffect, useState } from 'react';
import './Dashboard.css';
import Index from '../../models/Index';
import dashboardService from '../../services/DashboardService';
import IndexCard from './IndexCard';
import QuotesTable from './QuotesTable';

const Dashboard = () => {
  const [quoteDtos, setQuoteDtos] = useState([]);
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    dashboardService.getQuotes(['AMD'])
      .then(json => {
        const temp = json.data;
        temp.sort(function (a, b) {
          if (a.percentChange > b.percentChange) return -1;
          if (b.percentChange > a.percentChange) return 1;
          return 0;
        });
        setQuoteDtos(temp);
      })
      .catch(err => {
        console.log(err.message);
      });

    dashboardService.getIndices()
      .then(json => {
        setIndices(json.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

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
