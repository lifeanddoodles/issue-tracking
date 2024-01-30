import { twMerge } from "tailwind-merge";
import { IButtonProps } from "../../interfaces";
import { getVariantClasses } from "../../utils";

const Button = ({
  children,
  id,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className,
  ariaLabel,
}: IButtonProps) => {
  const mergedClassName = twMerge(`${getVariantClasses(variant)}`, className);

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      className={mergedClassName}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
