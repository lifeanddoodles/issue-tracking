import { twMerge } from "tailwind-merge";
const Form = ({
  children,
  onSubmit,
  className,
}: {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}) => {
  const mergedClasses = twMerge("mx-auto w-full max-w-md mb-8", className);

  return (
    <form className={mergedClasses} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
