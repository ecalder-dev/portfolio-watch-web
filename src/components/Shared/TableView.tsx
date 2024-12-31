import React from "react";
import "./TableView.css";

interface Column {
  header: string;
  accessor: string;
  render?: (data: any) => React.ReactNode;
}

interface SharedTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

const TableView: React.FC<SharedTableProps> = ({
  columns,
  data,
  onRowClick,
}) => {
  return (
    <table className="TableView-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th className="TableView-th" key={column.accessor}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) =>
          row ? (
            <tr
              className="TableView-tr"
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td className="TableView-td" key={column.accessor}>
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ) : null,
        )}
      </tbody>
    </table>
  );
};

export default TableView;
