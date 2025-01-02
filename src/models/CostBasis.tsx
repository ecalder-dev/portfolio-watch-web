import IObjectKeys from './IObjectKeys';
import Lot from './Lot';

interface CostBasis extends IObjectKeys {
  symbol: string;
  lotList: Lot[];
  adjustedPrice: number;
  totalShares: number;
  latestTransactionDate: Date;
}

export default CostBasis;
