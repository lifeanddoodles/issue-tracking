import { twMerge } from "tailwind-merge";

const Column = ({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const mergedClasses = twMerge("flex flex-col", className);

  return (
    <div id={id} className={mergedClasses}>
      {children}
    </div>
  );
};

export default Column;
