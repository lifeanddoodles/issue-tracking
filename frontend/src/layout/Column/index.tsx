const Column = ({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) => {
  return (
    <div id={id} className="flex flex-col">
      {children}
    </div>
  );
};

export default Column;
