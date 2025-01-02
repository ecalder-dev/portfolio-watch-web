import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import portfolioService from '../../services/PortfolioService';
import './Earnings.css';
import FieldValue from '../Shared/FieldView';
import AggregatedAnnualSale from '../../models/AggregatedAnnualSale';
import LotSaleDto from '../../models/LotSaleDto';
import formatter from '../../utils/Formatter';
import TableView from '../Shared/TableView';

const getDescriptionOfType = (type: string): string => {
  switch (type) {
    case 'TRANSACTIONAL':
      return 'Sell';
    case 'SPLIT_PARTIAL':
      return 'Split';
    case 'MERGE_PARTIAL':
      return 'Merge';
    case 'SPIN_OFF_PARTIAL':
      return 'Spin Off';
    default:
      return null;
  }
};

const Earnings: React.FC = () => {
  const [aggregatedAnnualSaleMap, setAggregatedAnnualSaleMap] = useState<
    Map<string, AggregatedAnnualSale>
  >(new Map());
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    try {
      portfolioService.getAllAggregatedSales().then((response) => {
        const data = response.data as Map<string, AggregatedAnnualSale>;
        const convertedData = new Map<string, AggregatedAnnualSale>(
          Object.entries(data),
        );
        setAggregatedAnnualSaleMap(convertedData);
      });
    } catch (error) {
      console.error('Failed to fetch tax years', error);
    }
  }, []);

  return (
    <div className="Earnings">
      <div className="Earnings-body">
        <h1 className="title">Earnings.</h1>
        <div className="EarningsList">
          <div className="CurrencySelector">
            <label htmlFor="currency">Currency in display: </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
          {Array.from(aggregatedAnnualSaleMap.entries())
            .reverse()
            .map(([year, aggregatedAnnualSale]) => (
              <AnnualEarningsCard
                key={year}
                year={year}
                currency={currency}
                aggregatedAnnualSale={aggregatedAnnualSale}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const AnnualEarningsCard = ({
  year,
  aggregatedAnnualSale,
  currency,
}: {
  year: string;
  aggregatedAnnualSale: AggregatedAnnualSale;
  currency: string;
}) => {
  const [lotListHidden, setAggregatedAnnualSaleListHidden] = useState(true);
  const [soldSharesList, setSoldSharesList] = useState<LotSaleDto[] | null>(
    null,
  );
  const onButtonClick = () => {
    if (!lotListHidden) {
      setAggregatedAnnualSaleListHidden(true);
      return;
    } else {
      if (soldSharesList) {
        setAggregatedAnnualSaleListHidden(false);
        return;
      } else {
        try {
          portfolioService.getSalesByTaxYear(year).then((response) => {
            const data = response.data as Array<LotSaleDto>;
            setSoldSharesList(data);
            setAggregatedAnnualSaleListHidden(false);
          });
        } catch (error) {
          console.error('Failed to fetch sales', error);
        }
      }
    }
  };
  return (
    <>
      <div className="EarningsCard">
        <div className="EarningsHeader">
          <div className="EarningsYear">{year}</div>
          <div className="EarningsFields">
            <FieldValue
              field={'Total Acquisition Price'}
              value={formatter.formatMoney(
                aggregatedAnnualSale.totalAcquisitionPrice[currency],
                currency,
              )}
            />
            <FieldValue
              field={'Total Sold Price'}
              value={formatter.formatMoney(
                aggregatedAnnualSale.totalSoldPrice[currency],
                currency,
              )}
            />
            <FieldValue
              field={'Total Realized Gain/Loss'}
              value={formatter.formatMoney(
                aggregatedAnnualSale.totalRealizedGainLoss[currency],
                currency,
              )}
            />
            <div>
              <button
                className="AggregatedAnnualSaleListViewButton"
                onClick={onButtonClick}
              >
                {lotListHidden ? 'Details' : 'Hide'}
              </button>
            </div>
          </div>
        </div>
        {soldSharesList && (
          <AggregatedAnnualSaleListView
            soldSharesList={soldSharesList}
            hidden={lotListHidden}
            currency={currency}
          />
        )}
      </div>
    </>
  );
};

const AggregatedAnnualSaleListView = ({
  soldSharesList,
  hidden,
  currency,
}: {
  soldSharesList: Array<LotSaleDto>;
  hidden: boolean;
  currency: string;
}) => {
  const saleList = soldSharesList
    ? (soldSharesList as LotSaleDto[])
    : ([] as LotSaleDto[]);

  const columns = [
    { header: 'Symbol', accessor: 'symbol' },
    {
      header: 'Type',
      accessor: 'type',
      render: (data) => getDescriptionOfType(data.type),
    },
    { header: 'Sold Shares', accessor: 'soldShares' },
    {
      header: 'Price Purchased',
      accessor: 'acquisitionPrice',
      render: (data) =>
        formatter.formatMoney(data.acquisitionPrice[currency], currency),
    },
    { header: 'Date Acquired', accessor: 'dateAcquired' },

    {
      header: 'Price Sold',
      accessor: 'soldPrice',
      render: (data) =>
        formatter.formatMoney(data.soldPrice[currency], currency),
    },
    { header: 'Date Sold', accessor: 'dateSold' },

    {
      header: 'Total Price Difference',
      accessor: 'totalPriceDifference',
      render: (data) =>
        formatter.formatMoney(data.totalPriceDifference[currency], currency),
    },
  ];

  return (
    <div className={`LotSaleListView ${hidden ? 'hidden' : ''}`}>
      <TableView columns={columns} data={saleList} />
    </div>
  );
};

export default Earnings;
