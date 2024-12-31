import Account from "../../models/Account";
import accountService from "../../services/AccountService";
import formatter from "../../utils/Formatter";

const showHiddenValue = (isHidden: boolean) => {
  return isHidden ? "Hidden" : "Shown";
};

const ViewAccountRow = ({ accounts, setAccounts, account, setEditable }) => {
  const deleteRow = (account: Account) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      accountService
        .deleteAccount(account.id)
        .then(() => {
          setAccounts(accounts.filter((p) => p.id !== account.id));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };
  return (
    <tr className="Account-tr">
      <td className="Account-td">{account.accountName}</td>
      <td className="Account-td">{account.accountNumber}</td>
      <td className="Account-td">
        {formatter.getFormattedDateStr(account.dateOpened)}
      </td>
      <td className="Account-td">
        {formatter.getFormattedDateStr(account.dateClosed)}
      </td>
      <td className="Account-td">{showHiddenValue(account.isHidden)}</td>

      <td className="Account-td">
        <button onClick={() => setEditable(account, true)}>Update</button>
        <button onClick={() => deleteRow(account)}>Delete</button>
      </td>
    </tr>
  );
};

export default ViewAccountRow;
