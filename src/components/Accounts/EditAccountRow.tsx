import { useState } from "react";
import DatePicker from 'react-datepicker';
import Account from "../../models/Account";
import accountService from "../../services/AccountService";

const EditAccountRow = ({ setEditable, accounts, account }) => {
  const [accountName, setAccountName] = useState<string>(account.accountName);
  const [accountNumber, setAccountNumber] = useState<string>(account.accountNumber);
  const [dateOpened, setDateOpened] = useState<Date>(new Date(account.dateOpened));
  const [dateClosed, setDateClosed] = useState<Date>(account.dateClosed ? new Date(account.dateClosed) : null);
  const [isHidden, setIsHidden] = useState(account.isHidden);

  const updateRow = (account: Account) => {
    accountService.putAccount(account)
      .then(() => {
        const index = accounts.findIndex(ac => ac.id === account.id);
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
    <td className="Account-td">
      <DatePicker
        selected={dateClosed}
        onChange={e => setDateClosed(e as Date)} name="dateClosed"
        dateFormat='M/d/yyyy'
      />
    </td>
    <td className="Account-td">
      <input
          type="checkbox"
          checked={isHidden}
          onChange={e => {
            setIsHidden(e.target.checked);
          }} name="isHidden"
      />
    </td>
    <td>
      <button onClick={() => updateRow({
        id: account.id,
        accountName: accountName,
        accountNumber: accountNumber,
        dateOpened: dateOpened,
        dateClosed: dateClosed,
        isHidden: isHidden
      })}>Save</button>
      <button onClick={() => cancelEditedRow(account)}>Cancel</button>
    </td>
  </tr>);
}

export default EditAccountRow;