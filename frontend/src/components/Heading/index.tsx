import { twMerge } from "tailwind-merge";

const getClasses = (level: number) => {
  switch (level) {
    case 1:
      return "text-3xl md:text-4xl xl:text-5xl";
    case 3:
      return "text-2xl";
    case 4:
      return "text-lg";
    case 2:
    default:
      return "text-4xl";
  }
};

const Heading = ({
  text,
  level = 2,
  marginBottom = 4,
  className,
}: {
  text: string;
  level?: 1 | 2 | 3 | 4;
  marginBottom?: number;
  className?: string;
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const mergedClasses = twMerge(
    `title-font text-neutral-900 dark:text-white font-medium mb-${marginBottom} ${getClasses(
      level
    )}`,
    className
  );

  return <Tag className={mergedClasses}>{text}</Tag>;
};

export default Heading;
