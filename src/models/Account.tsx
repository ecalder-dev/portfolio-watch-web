import IObjectKeys from './IObjectKeys';
import CostBasis from './CostBasis';

interface Account extends IObjectKeys {
  accountId: number;
  accountName: string;
  accountNumber: string;
  costBasisList?: CostBasis[];
  dateOpened: Date;
  datetimeInserted: Date;
  datetimeUpdated: Date;
}

export default Account;
