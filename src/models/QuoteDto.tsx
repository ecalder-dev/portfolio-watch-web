import IObjectKeys from './IObjectKeys';

interface QuoteDto extends IObjectKeys {
  symbol: string;
  shares: number;
  costBasis: number;
  currentPrice: number;
  averageVolume: number;
  dollarChange: number;
  percentChange: number;
  companyName: string;
  industry: string;
  sector: string;
  isEtf: boolean;
}

export default QuoteDto;
