import { ReactNode } from "react";

const Details = ({
  summary,
  children,
}: {
  summary: string | ReactNode;
  children: ReactNode;
}) => {
  return (
    <details className="py-2 px-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4 cursor-pointer">
      <summary className="font-bold">{summary}</summary>
      <div className="px-1">{children}</div>
    </details>
  );
};

export default Details;
