interface ITableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

const Table = ({ children, ...props }: ITableProps) => {
  return <table {...props}>{children}</table>;
};

export default Table;
