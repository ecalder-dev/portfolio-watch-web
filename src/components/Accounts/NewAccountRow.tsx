import { useState } from "react";
import DatePicker from "react-datepicker";
import Account from "../../models/Account";
import accountService from "../../services/AccountService";

const NewAccountRow = ({ accounts, setAccounts, setCreatingAccount }) => {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [dateOpened, setDateOpened] = useState(null);
  const [dateClosed, setDateClosed] = useState(null);
  const [isHidden, setIsHidden] = useState(false);

  const saveNewRow = (account: Account) => {
    accountService.postAccount(account).then((json) => {
      if (json.data) {
        accounts.push(json.data);
        setAccounts(accounts);
        setCreatingAccount(false);
      }
    });
  };

  const cancelNewRow = () => {
    setCreatingAccount(false);
  };

  return (
    <tr className="Account-tr">
      <td className="Account-td">
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          name="accountName"
        />
      </td>
      <td className="Account-td">
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          name="accountNumber"
        />
      </td>
      <td className="Account-td">
        <DatePicker
          selected={dateOpened}
          onChange={(e) => setDateOpened(e as Date)}
          name="dateOpened"
          dateFormat="M/d/yyyy"
        />
      </td>
      <td className="Account-td">
        <DatePicker
          selected={dateClosed}
          onChange={(e) => setDateClosed(e as Date)}
          name="dateClosed"
          dateFormat="M/d/yyyy"
        />
      </td>
      <td>
        <input
          type="checkbox"
          checked={isHidden}
          onChange={(e) => {
            setIsHidden(e.target.checked);
          }}
          name="isHidden"
        />
      </td>
      <td>
        <button
          onClick={() =>
            saveNewRow({
              accountName: accountName,
              accountNumber: accountNumber,
              dateOpened: dateOpened,
              dateClosed: dateClosed,
              isHidden: isHidden,
            })
          }
        >
          Save
        </button>
        <button onClick={cancelNewRow}>Cancel</button>
      </td>
    </tr>
  );
};

export default NewAccountRow;
