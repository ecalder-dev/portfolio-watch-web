import IObjectKeys from './IObjectKeys';
import Lot from './Lot';

interface CostBasis extends IObjectKeys {
 symbol: string;
 lotList: Lot[];
 adjustedPrice: number;
 totalShare: number;
 latestTransactionDate: Date;
}

export default CostBasis;
