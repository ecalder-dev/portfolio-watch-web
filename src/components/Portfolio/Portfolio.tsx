import { useEffect, useState } from 'react';
import CostBasis from '../../models/CostBasis';
import QuoteDto from '../../models/QuoteDto';
import dashboardService from '../../services/DashboardService';
import portfolioService from '../../services/PortfolioService';
import formatter from '../../utils/Formatter';
import './Portfolio.css';

const Portfolio = () => {
  const [costBasisList, setCostBasisList] = useState<CostBasis[]>([]);
  const [quoteDtos, setQuoteDtos] = useState<QuoteDto[]>([]);
  const [totalAssetValue, setTotalAssetValue] = useState<number>(0);

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

  return (
    <div className="Portfolio">
      <h1>Portfolio</h1>
      {costBasisList.map(
        (costBasis: CostBasis, index: number) => { 
          const quotes = quoteDtos.filter(quote => quote.symbol === costBasis.symbol);
          return <CostBasisCard costBasis={costBasis} quoteDto={quotes[0]} key={index} totalAssetValue={totalAssetValue} /> 
        }
      )}
    </div>
  )
}

const CostBasisCard = ({ costBasis, quoteDto, totalAssetValue }) => {
  const percent = quoteDto ? formatter.formatPerc((costBasis.totalShares * quoteDto.currentPrice) / totalAssetValue) : '--%';
  const curretPrice = quoteDto ? formatter.formatDollar(quoteDto.currentPrice) : "--";
  return (
    <div className='CostBasisCard'>
      <div>{costBasis.symbol}</div>
      <div>
        <FieldValue field={'Shares'} value={costBasis.totalShares} />
        <FieldValue field={'Cost Basis'} value={formatter.formatDollar(costBasis.adjustedPrice)} />
        <FieldValue field={'Current Price'} value={curretPrice} />
        <FieldValue field={'Last Transacted'} value={formatter.formatDate(costBasis.latestTransactionDate)} />
        <FieldValue field={'Diversification'} value={percent} />
      </div>
    </div>
  );
}

const FieldValue = ({ field, value }) => {

  return (
    <div className='FieldValue'>
      <div>{field}</div>
      <div>{value}</div>
    </div>

  );
}

export default Portfolio;
