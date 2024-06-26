import { ElementType, ForwardedRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type RowProps<T extends ElementType> = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

const Row = forwardRef(
  <T extends ElementType>(
    { id, children, className, as }: RowProps<T>,
    ref: ForwardedRef<React.ElementRef<T>>
  ) => {
    const mergedClasses = twMerge("flex flex-col md:flex-row", className);
    const Tag: ElementType = as || "div";

    return (
      <Tag id={id} className={mergedClasses} ref={ref}>
        {children}
      </Tag>
    );
  }
);

export default Row;
