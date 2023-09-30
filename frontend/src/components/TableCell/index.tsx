interface ITableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = ({ children, ...props }: ITableCellProps) => {
  return <td {...props}>{children}</td>;
};

export default TableCell;
