import { useEffect, useState } from "react";
import "./CorporateActions.css";
import CorporateAction from "../../models/CorporateAction";
import "react-datepicker/dist/react-datepicker.css";
import formatter from "../../utils/Formatter";
import { useHistory } from "react-router-dom";
import corporateActionService from "../../services/CorporateActionService";
import TableView from "../Shared/TableView";

const CorporateActions = () => {
  const [corporateActions, setCorporateActions] = useState<CorporateAction[]>(
    [],
  );
  const history = useHistory();
  const columns = [
    { header: "Type", accessor: "type" },
    { header: "Old Symbol", accessor: "oldSymbol" },
    { header: "New Symbol", accessor: "newSymbol" },
    { header: "Original Price", accessor: "originalPrice" },
    { header: "Spin-Off Price", accessor: "spinOffPrice" },
    {
      header: "Ratio",
      accessor: "ratio",
      render: (data) => toRatio(data.ratioAntecedent, data.ratioConsequent),
    },
    { header: "Date of Event", accessor: "dateOfEvent" },
  ];

  const goToAddNew = (): void => {
    history.push("/corporate-actions/form");
  };

  const goToEdit = (id: number): void => {
    history.push("/corporate-actions/form/" + id);
  };

  const toRatio = (
    ratioAntecedent: number,
    ratioConsequent: number,
  ): String => {
    return (
      formatter.formatNumber(ratioAntecedent) +
      ":" +
      formatter.formatNumber(ratioConsequent)
    );
  };

  useEffect(() => {
    let isSubscribed = true;
    corporateActionService
      .getCorporateActions()
      .then((json) => {
        const temp = json.data;
        temp.sort(function (a, b) {
          if (a.dateTransacted > b.dateTransacted) return -1;
          if (b.dateTransacted > a.dateTransacted) return 1;
          return 0;
        });
        if (isSubscribed) setCorporateActions(temp);
      })
      .catch((err) => {
        setCorporateActions([]);
        console.log(err.message);
      });
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="CorporateActions">
      <div className="CorporateActions-body">
        <h1 className="title">Corporate Actions.</h1>
        <div className="CorporateActionsAddNew">
          <button onClick={() => goToAddNew()}>New</button>
        </div>
        <TableView
          columns={columns}
          data={corporateActions}
          onRowClick={(corporateAction) => goToEdit(corporateAction.id)}
        />
      </div>
    </div>
  );
};

export default CorporateActions;
