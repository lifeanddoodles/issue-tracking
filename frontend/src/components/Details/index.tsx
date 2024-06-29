import React from "react";

const DescriptionList = ({
  summary,
  children,
}: {
  summary: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <details className="pt-2 px-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4 cursor-pointer">
      <summary className="font-bold mb-2">{summary}</summary>
      <div className="px-1">{children}</div>
    </details>
  );
};

export default DescriptionList;
