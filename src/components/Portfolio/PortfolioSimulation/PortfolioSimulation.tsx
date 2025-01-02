import { useEffect, useState } from 'react';
import formatter from '../../../utils/Formatter';
import './PortfolioSimulation.css';

interface SimulationFields {
  symbol: number;
  totalShares: number;
  simulatedTotalShares: number;
  currentPrice: number;
}

const PortfolioSimulation = ({ costBasisList, quoteDtos }) => {
  const [totalAssetValue, setTotalAssetValue] = useState(1);
  const [assetChangeValue, setAssetChangeValue] = useState(1);

  const [inputFields, setInputFields] = useState([]);
  const [isUpdateAssetValue, setIsUpdateAssetValue] = useState<boolean>(false);

  useEffect(() => {
    if (quoteDtos && quoteDtos.length > 0) {
      const newIputFields = costBasisList.map((costBasis) => {
        const quote = quoteDtos.filter(
          (quote) => quote.symbol === costBasis.symbol,
        )[0];
        return {
          symbol: costBasis.symbol,
          totalShares: costBasis.totalShares,
          simulatedTotalShares: costBasis.totalShares,
          currentPrice: quote.currentPrice,
        } as SimulationFields;
      });
      setInputFields(newIputFields);
      setIsUpdateAssetValue(true);
    }
  }, [costBasisList, quoteDtos]);

  useEffect(() => {
    if (isUpdateAssetValue) {
      if (inputFields && inputFields.length > 0) {
        let orginalSum: number = 0;
        let sum: number = 0;
        inputFields.forEach((field) => {
          orginalSum += field.totalShares * field.currentPrice;
          sum += field.simulatedTotalShares * field.currentPrice;
        });
        setTotalAssetValue(sum);
        setAssetChangeValue(sum - orginalSum);
      }
      setIsUpdateAssetValue(false);
    }
  }, [isUpdateAssetValue, inputFields]);

  return (
    <div className="Simulation">
      <AssetValueDisplay
        totalAssetValue={totalAssetValue}
        changeOfAssetValue={assetChangeValue}
      />
      {inputFields.map((simulationField: SimulationFields, index: number) => {
        return (
          <CostBasisCard
            simulationField={simulationField}
            key={`simulation-${index}`}
            totalAssetValue={totalAssetValue}
            setIsUpdateAssetValue={setIsUpdateAssetValue}
          />
        );
      })}
    </div>
  );
};

const AssetValueDisplay = ({ totalAssetValue, changeOfAssetValue }) => {
  return (
    <div className="AssetValueDisplay">
      Simulated Total: {formatter.formatDollar(totalAssetValue)}
      <span className={changeOfAssetValue > 0 ? 'positive' : 'negative'}>
        ({formatter.formatDollar(changeOfAssetValue)})
      </span>
    </div>
  );
};

const CostBasisCard = ({
  simulationField,
  totalAssetValue,
  setIsUpdateAssetValue,
}) => {
  const [simulatedTotalShares, setSimulatedTotalShares] = useState(
    simulationField.simulatedTotalShares,
  );
  const [currentPrice, setCurrentPrice] = useState(
    simulationField.currentPrice ? simulationField.currentPrice : 0,
  );

  useEffect(() => {
    simulationField.simulatedTotalShares = simulatedTotalShares;
    simulationField.currentPrice = currentPrice;
    setIsUpdateAssetValue(true);
  }, [
    simulatedTotalShares,
    currentPrice,
    setIsUpdateAssetValue,
    simulationField,
  ]);

  const getCurrentValue = (totalShares: number, currentPrice: number) => {
    return formatter.formatDollar(totalShares * currentPrice);
  };

  const getPercent = (totalShares: number, currentPrice: number) => {
    if (totalAssetValue === 0) {
      return '0%';
    }
    return formatter.formatPerc((totalShares * currentPrice) / totalAssetValue);
  };

  return (
    <>
      <div className="CostBasis">
        <div className="CostBasisHeader">
          <div className="Symbol">{simulationField.symbol}</div>
          <div className="CostBasisValues">
            <div className="Input">
              <FieldInput
                field={'Shares'}
                fieldValue={simulatedTotalShares}
                setFieldValue={setSimulatedTotalShares}
                originalValue={simulationField.totalShares}
                className="shares-input"
                withCounter={true}
              />
              <FieldInput
                field={'Current Price'}
                fieldValue={currentPrice}
                setFieldValue={setCurrentPrice}
                originalValue={currentPrice}
                className="price-input"
                withCounter={false}
              />
            </div>
          </div>
          <div className="Simulated">
            <FieldValue
              field={'Simulated Total Value'}
              value={getCurrentValue(simulatedTotalShares, currentPrice)}
            />
          </div>
          <div className="Simulated">
            <FieldValue
              field={'Simulated Diversification'}
              value={getPercent(simulatedTotalShares, currentPrice)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const FieldValue = ({ field, value }) => {
  return (
    <div className="FieldValue">
      <div className="Field">{field}</div>
      <div className="Value">{value}</div>
    </div>
  );
};

const FieldInput = ({
  field,
  fieldValue,
  originalValue,
  setFieldValue,
  className,
  withCounter,
}) => {
  const handleInputChange = (e: any) => {
    let value = e.target.value;
    let pattern = e.target.pattern;
    if (value) {
      if (value.match(pattern)) {
        setFieldValue(Number(e.target.value));
      }
    } else {
      setFieldValue(0);
    }
  };

  const increase = () => {
    setFieldValue(fieldValue + 1);
  };

  const decrease = () => {
    if (fieldValue > 0) {
      setFieldValue(fieldValue - 1);
    }
  };

  let difference = fieldValue - originalValue;
  let sign = null;
  if (difference !== 0) {
    sign = fieldValue > originalValue ? 'positive' : 'negative';
  }

  return (
    <div className="FieldInput">
      <div className="Field">{field}</div>
      <div className="Value">
        <input
          value={fieldValue}
          pattern="^\d*(\.\d{0,10})?$"
          onInput={(e) => handleInputChange(e)}
          className={className}
        />
        {sign && <span className={sign}>({fieldValue - originalValue})</span>}
        {withCounter && (
          <div className={'CounterButtons'}>
            <button onClick={decrease}>-</button>
            <button onClick={increase}>+</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSimulation;
