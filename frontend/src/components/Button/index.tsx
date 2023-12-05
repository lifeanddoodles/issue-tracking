import { twMerge } from "tailwind-merge";
import { ButtonVariant, getVariantClasses } from "../../utils";

export interface IButtonProps {
  label?: string;
  children: React.ReactNode;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

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
