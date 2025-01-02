import IObjectKeys from './IObjectKeys';

interface Index extends IObjectKeys {
  ticker: string;
  name: string;
  formattedName: string;
  lastPrice: number;
  priceChange: number;
  percentChange: number;
  timestamp: Date;
  url: string;
}

export default Index;
