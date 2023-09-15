const Box = ({ id, children }: { id?: string; children: React.ReactNode }) => {
  return (
    <div
      id={id}
      className="flex flex-col items-stretch border rounded py-2 px-4 w-full"
    >
      {children}
    </div>
  );
};

export default Box;
