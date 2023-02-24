import { useState, useEffect } from 'react';
import './Accounts.css';
import Account from '../../models/Account';
import 'react-datepicker/dist/react-datepicker.css';
import accountService from '../../services/AccountService';
import ViewAccountRow from './ViewAccountRow';
import EditAccountRow from './EditAccountRow';
import NewAccountRow from './NewAccountRow';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [isCreatingAccount, setCreatingAccount] = useState(false);

  const setEditable = (account: Account, value: boolean) => {
    account.isInEdit = value;
    setAccounts([...accounts]);
  }

  const addNewRow = () => {
    setCreatingAccount(true);
  }

  useEffect(() => {
    let isSubscribed = true;
    accountService.getAccounts()
      .then(json => {
        if (isSubscribed) setAccounts(json.data.map(account => ({ ...account, isInEdit: false })));
      })
      .catch(err => {
        console.log(err.message);
      });
    return () => { isSubscribed = false };
  }, []);

  return (
    <div className="Accounts">
      <div className="Accounts-body">
        <h1 className="title">Here are your accounts.</h1>
        <p>You can add, update and remove your accounts here.</p>
        <table className="Account-table">
          <thead>
            <tr className="Account-tr">
              <th className="Account-th">Account Name</th>
              <th className="Account-th">Account Number</th>
              <th className="Account-th">Date Opened</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account: Account, index: number) => {
              return !account.isInEdit ? (
                <ViewAccountRow accounts={accounts} setAccounts={setAccounts} account={account} setEditable={setEditable} key={index} />
              ) : (
                <EditAccountRow accounts={accounts} account={account} setEditable={setEditable} key={index} />
              )
            })}
            {isCreatingAccount ?
              <NewAccountRow accounts={accounts} setAccounts={setAccounts} setCreatingAccount={setCreatingAccount} />
              :
              <tr key='add-new-row'>
                <td colSpan={4}></td>
                <td>
                  <button onClick={() => addNewRow()}>Add New</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountsPage;
