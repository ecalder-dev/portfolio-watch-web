import IObjectKeys from "./IObjectKeys";
import CostBasis from "./CostBasis";

interface Account extends IObjectKeys {
  id?: number;
  accountName: string;
  accountNumber: string;
  dateOpened: Date;
  dateClosed: Date;
  isHidden: boolean;
  costBasisList?: CostBasis[];
  totalAnnualDividends?: number;
  isInEdit?: boolean;
}

export default Account;
