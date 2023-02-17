import QuoteDto from "../../models/QuoteDto";
import formatter from "../../utils/Formatter";

const QuotesTable = ( {quoteDtos} ) => {
    return (
        <table className="Dashboard-table">
            <thead>
                <tr className="Dashboard-tr">
                    <th className="Dashboard-th symbol">Symbol</th>
                    <th className="Dashboard-th price">Current Price</th>
                    <th className="Dashboard-th percent">Changes %</th>
                    <th className="Dashboard-th volume">Volume</th>
                    <th className="Dashboard-th sector">Sector</th>
                </tr>
            </thead>
            <tbody>
                {quoteDtos != null
                    && quoteDtos.map((quoteDto: QuoteDto, index: number) =>
                        <tr className="Dashboard-tr" key={'quoteDto' + index}>
                            <td className="Dashboard-td symbol">
                                {quoteDto.symbol}
                            </td>
                            <td className="Dashboard-td price">
                                {formatter.formatDollar(quoteDto.currentPrice)}
                            </td>
                            <td className={`Dashboard-td percent ${quoteDto.percentChange >= 0 ? "Green" : "Red"}`}>
                                {formatter.formatPerc(quoteDto.percentChange / 100)}
                            </td>
                            <td className="Dashboard-td volume">
                                {formatter.formatNumber(quoteDto.averageVolume)}
                            </td>
                            <td className="Dashboard-td sector">
                                {quoteDto.sector}
                            </td>
                        </tr>
                    )}
            </tbody>
        </table>
    );
}

export default QuotesTable;