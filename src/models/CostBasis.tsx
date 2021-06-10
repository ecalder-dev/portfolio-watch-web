import IObjectKeys from './IObjectKeys';
import Lot from './Lot';

interface CostBasis extends IObjectKeys {
 symbol: string;
 lotList: Lot[];
 adjustedPrice: number;
 totalShare: number;
}

export default CostBasis;
