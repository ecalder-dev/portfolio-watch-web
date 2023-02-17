import { useState } from "react";
import DatePicker from 'react-datepicker';
import Account from "../../models/Account";
import accountService from "../../services/AccountService";

const NewAccountRow = ({ accounts, setAccounts, setCreatingAccount }) => {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [dateOpened, setDateOpened] = useState(new Date());

  const saveNewRow = (account: Account) => {
    accountService.postAccount(account).then(json => {
      if (json.data) {
        accounts.push(json.data);
        setAccounts(accounts);
        setCreatingAccount(false);
      }
    });
  }

  const cancelNewRow = () => {
    setCreatingAccount(false);
  }

  return (
    <tr className="Account-tr">
      <td className="Account-td">
        <input type="text" value={accountName}
          onChange={e => setAccountName(e.target.value)} name="accountName" />
      </td>
      <td className="Account-td">
        <input type="text" value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)} name="accountNumber" />
      </td>
      <td className="Account-td">
        <DatePicker
          selected={dateOpened}
          onChange={e => setDateOpened(e as Date)} name="dateOpened"
          dateFormat='M/d/yyyy'
        />
      </td>
      <td>
        <button onClick={() => saveNewRow({
          accountId: 0,
          accountName: accountName,
          accountNumber: accountNumber,
          dateOpened: dateOpened,
          datetimeInserted: null,
          datetimeUpdated: null
        })}>Save</button>
        <button onClick={cancelNewRow}>Cancel</button>
      </td>
    </tr>
  );
}

export default NewAccountRow;