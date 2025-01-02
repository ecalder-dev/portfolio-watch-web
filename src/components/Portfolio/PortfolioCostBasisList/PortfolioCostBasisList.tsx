import { useState } from 'react';
import CostBasis from '../../../models/CostBasis';
import Lot from '../../../models/Lot';
import formatter from '../../../utils/Formatter';
import './PortfolioCostBasisList.css';
import FieldValue from '../../Shared/FieldView';

const PortfolioCostBasisList = ({
  costBasisList,
  quoteDtos,
  totalAssetValue,
}) => {
  return (
    <div className="CostBasisList">
      {costBasisList.map((costBasis: CostBasis, index: number) => {
        const quotes = quoteDtos.filter(
          (quote) => quote.symbol === costBasis.symbol,
        );
        return (
          <CostBasisCard
            costBasis={costBasis}
            quoteDto={quotes[0]}
            key={`costbasis-${index}`}
            totalAssetValue={totalAssetValue}
          />
        );
      })}
    </div>
  );
};

const CostBasisCard = ({ costBasis, quoteDto, totalAssetValue }) => {
  const percent = quoteDto
    ? formatter.formatPerc(
        (costBasis.totalShares * quoteDto.currentPrice) / totalAssetValue,
      )
    : '--%';
  const currentPrice = quoteDto
    ? formatter.formatDollar(quoteDto.currentPrice)
    : '--';
  const currentValue = quoteDto
    ? formatter.formatDollar(costBasis.totalShares * quoteDto.currentPrice)
    : '--%';
  const [lotListHidden, setLotListHidden] = useState(true);

  const onButtonClick = () => {
    setLotListHidden(!lotListHidden);
  };

  return (
    <>
      <div className="CostBasis">
        <div className="CostBasisHeader">
          <div>{costBasis.symbol}</div>
          <div>
            <FieldValue
              field={'Shares'}
              value={formatter.formatNumber(costBasis.totalShares)}
            />
            <FieldValue
              field={'Cost Basis'}
              value={formatter.formatDollar(costBasis.adjustedPrice)}
            />
            <FieldValue
              field={'Last Transacted'}
              value={costBasis.latestTransactionDate}
            />
            <FieldValue field={'Current Price'} value={currentPrice} />
            <FieldValue field={'Total Value'} value={currentValue} />
            <FieldValue field={'Diversification'} value={percent} />
            <div>
              <button className="LotListViewButton" onClick={onButtonClick}>
                {lotListHidden ? 'Details' : 'Hide'}
              </button>
            </div>
          </div>
        </div>
        <LotListView lotList={costBasis.lotList} hidden={lotListHidden} />
      </div>
    </>
  );
};

const LotListView = ({ lotList, hidden }) => {
  const lots = lotList ? (lotList as Lot[]) : ([] as Lot[]);
  return (
    <div className={`LotListView ${hidden ? 'hidden' : ''}`}>
      {lots.map((lot: Lot) => {
        return (
          <div className="LotListCard" key={lot.lotId}>
            <FieldValue
              field={'Shares'}
              value={formatter.formatNumber(lot.shares)}
            />
            <FieldValue
              field={'Price Purchased'}
              value={formatter.formatDollar(lot.price)}
            />
            <FieldValue field={'Date Transacted'} value={lot.dateTransacted} />
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioCostBasisList;
