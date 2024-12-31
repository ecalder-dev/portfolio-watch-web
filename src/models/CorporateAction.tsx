import IObjectKeys from "./IObjectKeys";

interface CorporateAction extends IObjectKeys {
  id: number;
  type: string;
  oldSymbol: string;
  newSymbol: string;
  originalPrice: number;
  spinOffPrice: number;
  ratioAntecedent: number;
  ratioConsequent: number;
  dateOfEvent: Date;
}

export default CorporateAction;
