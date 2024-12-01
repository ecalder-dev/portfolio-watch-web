import Account from './Account';
import IObjectKeys from './IObjectKeys';

interface Lot extends IObjectKeys {
  id: number;
  symbol: string;
  shares: number;
  price: number;
  dateTransacted: Date;
  account: Account;
}

export default Lot;
