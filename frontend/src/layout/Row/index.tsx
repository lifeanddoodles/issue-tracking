import { ForwardedRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Row = forwardRef(
  (
    {
      id,
      children,
      className,
    }: {
      id?: string;
      children: React.ReactNode;
      className?: string;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const mergedClasses = twMerge("flex flex-col md:flex-row", className);

    return (
      <div id={id} className={mergedClasses} ref={ref}>
        {children}
      </div>
    );
  }
);

export default Row;
