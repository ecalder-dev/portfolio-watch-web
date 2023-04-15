import { useEffect, useState } from 'react';
import CostBasis from '../../models/CostBasis';
import QuoteDto from '../../models/QuoteDto';
import dashboardService from '../../services/DashboardService';
import portfolioService from '../../services/PortfolioService';
import './Portfolio.css';
import PortfolioCostBasisList from './PortfolioCostBasisList/PortfolioCostBasisList';
import PortfolioSimulation from './PortfolioSimulation/PortfolioSimulation';

const Portfolio = () => {
  const [costBasisList, setCostBasisList] = useState<CostBasis[]>([]);
  const [quoteDtos, setQuoteDtos] = useState<QuoteDto[]>([]);
  const [totalAssetValue, setTotalAssetValue] = useState<number>(0);
  const [showSimulate, setShowSimulate] = useState<boolean>(false);

  useEffect(() => {
    let isSubscribed = true;
    portfolioService.getCostBasis()
      .then(json => {
        let temp = json.data;
        temp = temp.sort((a, b) => (a.symbol > b.symbol) ? 1 : ((b.symbol > a.symbol) ? -1 : 0));
        if (isSubscribed) setCostBasisList(temp);
      })
      .catch(err => {
        console.log(err.message);
      });
    return () => { isSubscribed = false };
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (costBasisList.length > 0) {
      dashboardService.getQuotes(costBasisList.map(costbasis => costbasis.symbol))
        .then(json => {
          const temp = json.data as QuoteDto[];
          if (isSubscribed) setQuoteDtos(temp);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
    return () => { isSubscribed = false };
  }, [costBasisList]);

  useEffect(() => {
    let tempTotalAssetValue = 0;
    if (quoteDtos.length > 0 && costBasisList.length > 0) {
      tempTotalAssetValue = 0;
      costBasisList.forEach(costBasis => {
        const quotes = quoteDtos.filter(quote => quote.symbol === costBasis.symbol);
        if (quotes.length > 0) {
          tempTotalAssetValue += quotes[0].currentPrice * costBasis.totalShares;
        }
      });
      tempTotalAssetValue = Math.round((tempTotalAssetValue + Number.EPSILON) * 100) / 100;
      setTotalAssetValue(tempTotalAssetValue);
    }
  }, [quoteDtos, costBasisList]);

  const toggleSimulate = () => {
    setShowSimulate(!showSimulate);
  }

  return (
    <div className="Portfolio">
      <div className="Title">
        <h1>Portfolio</h1>
        {!showSimulate && <button className='LotListViewButton' onClick={toggleSimulate}>Simulate</button>}
        {showSimulate && <button className='LotListViewButton' onClick={toggleSimulate}>Cost Basis</button>}
      </div>
      {!showSimulate && <PortfolioCostBasisList costBasisList={costBasisList} quoteDtos={quoteDtos} totalAssetValue={totalAssetValue} />}
      {showSimulate && <PortfolioSimulation costBasisList={costBasisList} quoteDtos={quoteDtos}/>}

    </div>
  )
}

export default Portfolio;
