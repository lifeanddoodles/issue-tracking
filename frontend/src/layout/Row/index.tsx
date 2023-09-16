import { twMerge } from "tailwind-merge";

const Row = ({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const mergedClasses = twMerge("flex flex-col md:flex-row", className);

  return (
    <div id={id} className={mergedClasses}>
      {children}
    </div>
  );
};

export default Row;
