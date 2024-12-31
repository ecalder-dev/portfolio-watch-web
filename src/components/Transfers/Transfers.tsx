import { ReactElement, useEffect, useState } from "react";
import "./Transfers.css";
import Transfer from "../../models/Transfer";
import "react-datepicker/dist/react-datepicker.css";
import formatter from "../../utils/Formatter";
import { useHistory } from "react-router-dom";
import transferService from "../../services/TransferService";
import Account from "../../models/Account";
import TableView from "../Shared/TableView";

const Transfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const history = useHistory();
  const columns = [
    { header: "Symbol", accessor: "symbol" },
    {
      header: "Shares",
      accessor: "shares",
      render: (data) => formatter.formatNumber(data.shares),
    },
    {
      header: "From Account",
      accessor: "fromAccount",
      render: (data) => createAccountDisplay(data.fromAccount),
    },
    {
      header: "To Account",
      accessor: "toAccount",
      render: (data) => createAccountDisplay(data.toAccount),
    },
    { header: "Date", accessor: "dateTransacted" },
  ];

  const createAccountDisplay = (account: Account): ReactElement => {
    return (
      <span>{account.accountName + " (" + account.accountNumber + ")"}</span>
    );
  };

  const goToAddNew = (): void => {
    history.push("/transfers/form");
  };

  const goToEdit = (id: number): void => {
    history.push("/transfers/form/" + id);
  };

  useEffect(() => {
    let isSubscribed = true;
    transferService
      .getTransfers()
      .then((json) => {
        const temp = json.data;
        temp.sort(function (a, b) {
          if (a.dateTransacted > b.dateTransacted) return -1;
          if (b.dateTransacted > a.dateTransacted) return 1;
          return 0;
        });
        if (isSubscribed) setTransfers(temp);
      })
      .catch((err) => {
        setTransfers([]);
        console.log(err.message);
      });
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="Transfers">
      <div className="Transfers-body">
        <h1 className="title">Transfers.</h1>
        <div className="TransfersAddNew">
          <button onClick={() => goToAddNew()}>New</button>
        </div>
        <TableView
          columns={columns}
          data={transfers}
          onRowClick={(transaction) => goToEdit(transaction.id)}
        />
      </div>
    </div>
  );
};

export default Transfers;
