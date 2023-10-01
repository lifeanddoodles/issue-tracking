import { twMerge } from "tailwind-merge";

const Badge = ({ text, className }: { text: string; className?: string }) => {
  const mergedClasses = twMerge(
    `block whitespace-nowrap text-sm text-center text-neutral-900 dark:text-white rounded-full py-1 px-3`,
    className
  );
  return <span className={mergedClasses}>{text}</span>;
};

export default Badge;
