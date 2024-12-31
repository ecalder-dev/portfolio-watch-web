import formatter from "../../utils/Formatter";

const IndexCard = ({ marketIndex }) => {
  return (
    <div className="IndexCard">
      <div className="IndexName">{marketIndex.ticker}</div>
      <div className="IndexStats">
        <span className="IndexStatsLastPrice">
          {formatter.formatNumber(marketIndex.lastPrice)}
        </span>
        <span
          className={`IndexStatsPercChange ${marketIndex.percentChange >= 0 ? "Green" : "Red"}`}
        >
          {marketIndex.percentChange} %
        </span>
      </div>
    </div>
  );
};

export default IndexCard;
