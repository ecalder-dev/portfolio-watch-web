import IObjectKeys from './IObjectKeys';
import Account from './Account';

interface Transaction extends IObjectKeys {
  id: number;
  price: number;
  symbol: string;
  shares: number;
  dateTransacted: Date;
  type: string;
  account: Account;
}

export default Transaction;
