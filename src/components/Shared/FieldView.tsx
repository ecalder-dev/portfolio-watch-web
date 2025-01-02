const FieldValue = ({ field, value }) => {
  return (
    <div className="FieldValue">
      <div>{field}</div>
      <div>{value}</div>
    </div>
  );
};

export default FieldValue;
