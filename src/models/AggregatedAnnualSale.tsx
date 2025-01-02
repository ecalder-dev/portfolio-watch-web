interface AggregatedAnnualSaleDto {
  year: number;
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

export default AggregatedAnnualSaleDto;
