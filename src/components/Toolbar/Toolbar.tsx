import React from 'react';
import './Toolbar.css';
import { withRouter} from "react-router-dom";

interface State {
  page: string;
}

class Toolbar extends React.Component<any, State>  {

  constructor(props: any) {
    super(props);
    this.state = {
      page: this.props.location.pathname
    }
  }

  goTo(page: string) {
    this.props.history.push(page);
    this.setState({page: page});
  }

  render() {
    let page = this.state.page;

    return (
      <div className="Toolbar">
        <div className="Toolbar-item">
          <button onClick={() => this.goTo('/dashboard')}
            className={`${page === '/dashboard' ? "isActive": ""}`}>
            Current Events
          </button>
        </div>
        <div className="Toolbar-item">
          <button onClick={() => this.goTo('/cost-basis')}
          className={`${page === '/cost-basis' ? "isActive": ""}`}>
            Portfolio
          </button>
        </div>
        <div className="Toolbar-item">
          <button onClick={() => this.goTo('/transactions')}
          className={`${page === '/transactions' ? "isActive": ""}`}>
            Transactions
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Toolbar);
