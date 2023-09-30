interface ITableHeadingProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

const TableHeading = ({ children, ...props }: ITableHeadingProps) => {
  return <th {...props}>{children}</th>;
};

export default TableHeading;
