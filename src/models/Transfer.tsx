import IObjectKeys from './IObjectKeys';
import Account from './Account';

interface Transfer extends IObjectKeys {
  id: number;
  symbol: string;
  shares: number;
  dateTransacted: Date;
  fromAccount: Account;
  toAccount: Account;
}


export default Transfer;
