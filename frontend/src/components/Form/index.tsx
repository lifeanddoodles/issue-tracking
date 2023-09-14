const Form = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <form className="mx-auto w-full max-w-md" onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
