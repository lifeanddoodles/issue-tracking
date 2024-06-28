import React from "react";
import { twMerge } from "tailwind-merge";

const ExternalLink = ({
  children,
  href,
  className,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  const classes = twMerge("flex place-items-center gap-2", className);
  return (
    <a
      className={classes}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
