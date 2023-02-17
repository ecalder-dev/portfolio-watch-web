import { useState } from "react";
import DatePicker from 'react-datepicker';
import Account from "../../models/Account";
import accountService from "../../services/AccountService";

const EditAccountRow = ({ setEditable, accounts, account }) => {
  const [accountName, setAccountName] = useState(account.accountName);
  const [accountNumber, setAccountNumber] = useState(account.accountNumber);
  const [dateOpened, setDateOpened] = useState(account.dateOpened);

  const updateRow = (account: Account) => {
    accountService.putAccount(account)
      .then(() => {
        const index = accounts.findIndex(ac => ac.accountId === account.accountId);
        if (index >= 0) {
          accounts[index] = account;
        }
        setEditable(account, false);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  const cancelEditedRow = (account: Account) => {
    setEditable(account, false);
  }

  return (<tr className="Account-tr">
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
      <button onClick={() => updateRow({
        accountId: account.accountId,
        accountName: accountName,
        accountNumber: accountNumber,
        dateOpened: dateOpened,
        datetimeInserted: account.datetimeInserted,
        datetimeUpdated: new Date()
      })}>Save</button>
      <button onClick={() => cancelEditedRow(account)}>Cancel</button>
    </td>
  </tr>);
}

export default EditAccountRow;