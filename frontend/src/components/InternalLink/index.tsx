import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { ButtonVariant, getVariantClasses } from "../../utils";

const InternalLink = ({
  to,
  className,
  children,
  variant = "transparent",
  ariaLabel,
  ...props
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  ariaLabel?: string;
}) => {
  const classes = variant
    ? twMerge(`${getVariantClasses(variant)}`, className)
    : className;

  return (
    <Link to={to} className={classes} aria-label={ariaLabel} {...props}>
      {children}
    </Link>
  );
};

export default InternalLink;
