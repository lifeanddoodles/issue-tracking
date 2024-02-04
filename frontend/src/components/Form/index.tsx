import { twMerge } from "tailwind-merge";
const Form = ({
  children,
  onSubmit,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  ariaLabel?: string;
}) => {
  const mergedClasses = twMerge("mx-auto w-full max-w-md mb-8", className);

  return (
    <form className={mergedClasses} onSubmit={onSubmit} aria-label={ariaLabel}>
      {children}
    </form>
  );
};

export default Form;
