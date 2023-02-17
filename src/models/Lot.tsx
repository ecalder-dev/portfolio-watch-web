import Account from './Account';
import IObjectKeys from './IObjectKeys';

interface Lot extends IObjectKeys {
  lotId: number;
  symbol: string;
  shares: number;
  price: number;
  dateTransacted: Date;
  datetimeInserted: Date;
  datetimeUpdated: Date;
  account: Account;
}

export default Lot;
