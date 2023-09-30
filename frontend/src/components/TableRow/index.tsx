interface ITableRowProps
  extends React.TableHTMLAttributes<HTMLTableRowElement> {}

const TableRow = ({ children, ...props }: ITableRowProps) => {
  return <tr {...props}>{children}</tr>;
};

export default TableRow;
