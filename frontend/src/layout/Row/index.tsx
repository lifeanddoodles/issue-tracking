const Row = ({ id, children }: { id?: string; children: React.ReactNode }) => {
  return (
    <div id={id} className="flex sm:flex-col md:flex-row">
      {children}
    </div>
  );
};

export default Row;
