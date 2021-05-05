import IObjectKeys from './IObjectKeys';

interface Account extends IObjectKeys {
  accountId: number;
  accountName: string;
  accountNumber: string;
  dateOpened: Date;
  datetimeInserted: string;
  datetimeUpdated: string;
}

export default Account;
