import IObjectKeys from './IObjectKeys';
import Account from './Account';

interface Transaction extends IObjectKeys {
  transactionId: number;
  type: string;
  symbol: string;
  shares: number;
  price: number;
  account: Account;
  dateTransacted: Date;
  dateSettled: Date;
  datetimeInserted: Date;
  datetimeUpdated: Date;
}

export default Transaction;
