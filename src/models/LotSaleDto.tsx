interface LotSaleDto {
  id: string;
  symbol: string;
  type: string;
  soldShares: number;
  taxYear: number;
  dateAcquired: string;
  dateSold: string;
  totalAcquisitionPrice: {
    [key: string]: number;
  };
  totalSoldPrice: {
    [key: string]: number;
  };
  totalRealizedGainLoss: {
    [key: string]: number;
  };
}

export default LotSaleDto;
