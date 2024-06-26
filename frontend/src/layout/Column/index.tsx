import { twMerge } from "tailwind-merge";

const Column = ({
  id,
  children,
  className,
  as,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) => {
  const mergedClasses = twMerge("flex flex-col", className);
  const Tag = as || "div";

  return (
    <Tag id={id} className={mergedClasses}>
      {children}
    </Tag>
  );
};

export default Column;
