import IObjectKeys from './IObjectKeys';

interface DividendProfile extends IObjectKeys {
  symbol: string;
  yield: string;
  annualizedDividend: number;
  payoutRatio: number;
  exDividendDate: Date;
  dividendPaymentDate: Date;
}

export default DividendProfile;
