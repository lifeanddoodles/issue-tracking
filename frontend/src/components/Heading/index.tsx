import { twMerge } from "tailwind-merge";
import { getClasses } from "./utils";

const Heading = ({
  text,
  level = 2,
  marginBottom = 4,
  className,
  role,
}: {
  text: string;
  level?: 1 | 2 | 3 | 4;
  marginBottom?: number;
  className?: string;
  role?: string;
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const mergedClasses = twMerge(
    `title-font text-neutral-900 dark:text-white font-medium mb-${marginBottom} ${getClasses(
      level
    )}`,
    className
  );

  return (
    <Tag className={mergedClasses} role={role}>
      {text}
    </Tag>
  );
};

export default Heading;
