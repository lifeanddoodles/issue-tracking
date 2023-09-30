interface ITableHeadProps
  extends React.TableHTMLAttributes<HTMLTableSectionElement> {}

const TableHead = ({ children, ...props }: ITableHeadProps) => {
  return <thead {...props}>{children}</thead>;
};

export default TableHead;
