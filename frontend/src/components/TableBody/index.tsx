interface ITableBodyProps
  extends React.TableHTMLAttributes<HTMLTableSectionElement> {}

const TableBody = ({ children, ...props }: ITableBodyProps) => {
  return <tbody {...props}>{children}</tbody>;
};

export default TableBody;
