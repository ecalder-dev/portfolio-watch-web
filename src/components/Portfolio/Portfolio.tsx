import React from 'react';
import './Portfolio.css';
import Account from '../../models/Account';
import CostBasis from '../../models/CostBasis';
import Lot from '../../models/Lot';
import formatter from '../../utils/Formatter';
import accountService from '../../services/AccountService';

interface State {
  accounts: Account[];
  detailsInDisplay: Set<string>;
}

class Portfolio extends React.Component<any, State> {
  detailsInDisplay: Set<string>;

  constructor(props: any) {
    super(props);
    this.state = {
      accounts: [],
      detailsInDisplay: new Set<string>()
    };
  }

  componentDidMount() {
    accountService.getAccounts(true).then(json => {
      const accountData = json.data ? json.data : [];
      let symbols = new Set<string>();
      accountData.forEach(account => {
        if (account.costBasisList) {
          account.costBasisList.forEach(costBasis => {
            symbols.add(costBasis.symbol);
          });
        }
      });
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  toggleLotListDetail(key: string) {
      let temp = this.state.detailsInDisplay;
      if (temp.has(key)) {
        temp.delete(key);
      } else {
        temp.add(key);
      }
      this.setState({detailsInDisplay: temp});
  }

  createAccountHeader(accounts: Account[]) {
    var items = accounts.map((account, index) => {
        if (account != null && account.costBasisList.length > 0) {
          return (
            <div key={'account' + index}>
              <p className="accountName">{account.accountName} ({account.accountNumber})</p>
              <div className="CostBasisOverviewTable">
                <div className="CostBasisOverviewHeaderRow">
                  <div className="CostBasisOverviewHeader">Symbol</div>
                  <div className="CostBasisOverviewHeader">Total Shares</div>
                  <div className="CostBasisOverviewHeader">Adjusted Price</div>
                  <div className="CostBasisOverviewHeader">Total Annual Dividend</div>
                </div>
                {this.createCostBasisList(account.accountName, account.costBasisList)}
              </div>
              <div>
                <p>Total annual dividends: {formatter.formatDollar(account.totalAnnualDividends)}</p>
              </div>
            </div>
          )
        } else {
          return (<div key={'account' + index}></div>)
        }
      });
    return items;
  }

  createCostBasisList(accountName: string, costBases: CostBasis[]) {
    var items = costBases.map((costBasis: CostBasis, index: number) => {
        const key = accountName + '-' + costBasis.symbol;
        return (
          <div key={'cost-basis-element' + index} >
            <div className="CostBasisOverviewRow" key={'cost-basis-row' + index}
            onClick={() => this.toggleLotListDetail(key)}>
              <div className="CostBasisOverviewColumn" key={'cost-basis-' + index + '-symbol'}>
                {costBasis.symbol}
              </div>
              <div className="CostBasisOverviewColumn" key={'cost-basis-' + index+ '-totalShares'}>
                {costBasis.totalShares}
              </div>
              <div className="CostBasisOverviewColumn" key={'cost-basis-' + index+ '-adjustedPrice'}>
                {formatter.formatDollar(costBasis.adjustedPrice)}
              </div>
              <div className="CostBasisOverviewColumn" key={'cost-basis-' + index+ '-totalAnnualDividend'}>
                {formatter.formatDollar(costBasis.totalAnnualDividends)}
              </div>
            </div>
            {this.createLotList(key, costBasis.symbol, costBasis.lotList)}
          </div>
        )
      });
    return items;
  }

  createLotList(key: string, symbol: string, lots: Lot[]) {
    var items = lots.map((lot, index) => {
        return (
          <div className={`CostBasisOverviewSubRow ${this.state.detailsInDisplay.has(key) ? "": "hide"}`} key={symbol + '_lot' + index}>
            <div className="CostBasisOverviewSubColumn">{formatter.formatDate(lot.dateTransacted)}</div>
            <div className="CostBasisOverviewSubColumn">{formatter.formatNumber(lot.shares)}</div>
            <div className="CostBasisOverviewSubColumn">{formatter.formatDollar(lot.price)}</div>
            <div className="CostBasisOverviewSubColumn"></div>
          </div>
        )
      });
    return items;
  }

  render() {
    let accounts = this.state.accounts;
    return (
      <div className="CostBasisListing">
        <div className="CostBasisListing-body">
          <div>
            {this.createAccountHeader(accounts)}
          </div>
        </div>
      </div>
    );
  }
}

export default Portfolio;
