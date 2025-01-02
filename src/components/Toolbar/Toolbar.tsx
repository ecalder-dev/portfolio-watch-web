import { useState } from 'react';
import './Toolbar.css';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';

const Toolbar = (props: RouteComponentProps) => {
  const [page, setPage] = useState('');
  const history = useHistory();

  const goTo = (page: string) => {
    history.push(page);
    setPage(page);
  };

  return (
    <div className="Toolbar">
      <div className="Toolbar-item">
        <button
          onClick={() => goTo('/dashboard')}
          className={`${page === '/dashboard' ? 'isActive' : ''}`}
        >
          Current Events
        </button>
      </div>
      <div className="Toolbar-item">
        <button
          onClick={() => goTo('/cost-basis')}
          className={`${page === '/cost-basis' ? 'isActive' : ''}`}
        >
          Portfolio
        </button>
      </div>
      <div className="Toolbar-item">
        <button
          onClick={() => goTo('/corporate-actions')}
          className={`${page === '/corporate-actions' ? 'isActive' : ''}`}
        >
          Corporate Actions
        </button>
      </div>
      <div className="Toolbar-item">
        <button
          onClick={() => goTo('/transactions')}
          className={`${page === '/transactions' ? 'isActive' : ''}`}
        >
          Transactions
        </button>
      </div>
      <div className="Toolbar-item">
        <button
          onClick={() => goTo('/transfers')}
          className={`${page === '/transfers' ? 'isActive' : ''}`}
        >
          Transfers
        </button>
      </div>
      <div className="Toolbar-item">
        <button
          onClick={() => goTo('/accounts')}
          className={`${page === '/accounts' ? 'isActive' : ''}`}
        >
          Accounts
        </button>
      </div>
    </div>
  );
};

export default withRouter(Toolbar);
