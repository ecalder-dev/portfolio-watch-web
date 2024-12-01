import { useEffect, useState } from 'react';
import './CorporateActions.css';
import CorporateAction from '../../models/CorporateAction';
import 'react-datepicker/dist/react-datepicker.css';
import formatter from '../../utils/Formatter';
import { useHistory } from 'react-router-dom';
import corporateActionService from '../../services/CorporateActionService';

const CorporateActions = () => {
  const [corporateActions, setCorporateActions] = useState<CorporateAction[]>([]); 
  const history = useHistory();

  const goToAddNew = (): void => {
    history.push('/corporate-actions/form');
  }

  const goToEdit = (id: number): void => {
    history.push('/corporate-actions/form/' + id);
  }

  const toRatio = (ratioAntecedent: number, ratioConsequent: number): String => {
    return formatter.formatNumber(ratioAntecedent) + ":" + formatter.formatNumber(ratioConsequent);
  }

  useEffect(() => {
    let isSubscribed = true;
    corporateActionService.getCorporateActions()
      .then(json => {
        const temp = json.data;
        temp.sort(function (a, b) {
          if (a.dateTransacted > b.dateTransacted) return -1;
          if (b.dateTransacted > a.dateTransacted) return 1;
          return 0;
        });
        if (isSubscribed) setCorporateActions(temp);
      })
      .catch(err => {
        setCorporateActions([]);
        console.log(err.message);
      });
    return () => { isSubscribed = false };
  }, []);

  return (
    <div className="CorporateActions">
      <div className="CorporateActions-body">
        <h1 className="title">Corporate Actions.</h1>
        <div className="CorporateActionsAddNew">
          <button onClick={() => goToAddNew()}>New</button>
        </div>
        <table className="CorporateAction-table">
          <thead>
            <tr className="CorporateAction-tr">
              <th className="CorporateAction-th">Type</th>
              <th className="CorporateAction-th">Old Symbol</th>
              <th className="CorporateAction-th">New Symbol</th>
              <th className="CorporateAction-th">Original Price</th>
              <th className="CorporateAction-th">Spin Off Price</th>
              <th className="CorporateAction-th">Ratio</th>
              <th className="CorporateAction-th">Date of Event</th>
            </tr>
          </thead>
          <tbody>
            {corporateActions != null && corporateActions.map((corporateAction: CorporateAction) =>
            (<tr className="CorporateAction-tr" key={corporateAction.id}
              onClick={() => goToEdit(corporateAction.id)}>
              <td className="CorporateAction-td">{corporateAction.type}</td>
              <td className="CorporateAction-td">{corporateAction.oldSymbol}</td>
              <td className="CorporateAction-td">{corporateAction.newSymbol}</td>
              <td className="CorporateAction-td">{formatter.formatNumber(corporateAction.originalPrice)}</td>
              <td className="CorporateAction-td">{formatter.formatNumber(corporateAction.spinOffPrice)}</td>
              <td className="CorporateAction-td">{toRatio(corporateAction.ratioAntecedent, corporateAction.ratioConsequent)}</td>
              <td className="CorporateAction-td">{formatter.getFormattedDateStr(corporateAction.dateOfEvent)}</td>
            </tr>))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CorporateActions;
