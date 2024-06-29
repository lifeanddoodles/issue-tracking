import React from "react";

const DescriptionList = ({
  summary,
  children,
}: {
  summary: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    // TODO: Add styles
    <details className="">
      <summary className="">{summary}</summary>
      {children}
    </details>
  );
};

export default DescriptionList;
