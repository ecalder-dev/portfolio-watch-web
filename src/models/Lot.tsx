import IObjectKeys from './IObjectKeys';

interface Lot extends IObjectKeys {
  shares: number;
  price: number;
  dateTransacted: Date;
}

export default Lot;
