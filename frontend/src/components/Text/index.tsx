import { twMerge } from "tailwind-merge";
import { TextProps } from "./Text.types";

const Text = ({
  children,
  as = "p",
  size = "base",
  className,
  role,
  id,
}: TextProps) => {
  const Tag = `${as}` as keyof JSX.IntrinsicElements;
  const mergedClasses = twMerge(`font-normal text-${size} mb-2`, className);

  return (
    <Tag className={mergedClasses} role={role} id={id}>
      {children}
    </Tag>
  );
};

export default Text;
