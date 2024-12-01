import { useEffect, useState } from 'react';
import './Transfers.css';
import Transfer from '../../models/Transfer';
import 'react-datepicker/dist/react-datepicker.css';
import formatter from '../../utils/Formatter';
import { useHistory } from 'react-router-dom';
import transferService from '../../services/TransferService';

const Transfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const history = useHistory();

  const goToAddNew = (): void => {
    history.push('/transfers/form');
  }

  const goToEdit = (id: number): void => {
    history.push('/transfers/form/' + id);
  }

  useEffect(() => {
    let isSubscribed = true;
    transferService.getTransfers()
      .then(json => {
        const temp = json.data;
        temp.sort(function (a, b) {
          if (a.dateTransacted > b.dateTransacted) return -1;
          if (b.dateTransacted > a.dateTransacted) return 1;
          return 0;
        });
        if (isSubscribed) setTransfers(temp);
      })
      .catch(err => {
        setTransfers([]);
        console.log(err.message);
      });
    return () => { isSubscribed = false };
  }, []);

  return (
    <div className="Transfers">
      <div className="Transfers-body">
        <h1 className="title">Transfers.</h1>
        <div className="TransfersAddNew">
          <button onClick={() => goToAddNew()}>New</button>
        </div>
        <table className="Transfer-table">
          <thead>
            <tr className="Transfer-tr">
              <th className="Transfer-th">Symbol</th>
              <th className="Transfer-th">Shares to Transfer</th>
              <th className="Transfer-th">From Account</th>
              <th className="Transfer-th">To Account</th>
              <th className="Transfer-th">Date of Transfer</th>
            </tr>
          </thead>
          <tbody>
            {transfers != null && transfers.map((transfer: Transfer) =>
            (<tr className="Transfer-tr" key={transfer.id}
              onClick={() => goToEdit(transfer.id)}>
              <td className="Transfer-td">{transfer.symbol}</td>
              <td className="Transfer-td">{formatter.formatNumber(transfer.shares)}</td>
              <td className="Transfer-td account">{transfer.fromAccount.accountName
                + ' (' + transfer.fromAccount.accountNumber + ')'}</td>
              <td className="Transfer-td account">{transfer.toAccount.accountName
                + ' (' + transfer.toAccount.accountNumber + ')'}</td>
              <td className="Transfer-td">{formatter.getFormattedDateStr(transfer.dateTransacted)}</td>
            </tr>))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transfers;
