import IObjectKeys from './IObjectKeys';

interface Position extends IObjectKeys {
  positionId: number;
  costBasis: number;
  shares: number;
  symbol: string;
}

export default Position;
