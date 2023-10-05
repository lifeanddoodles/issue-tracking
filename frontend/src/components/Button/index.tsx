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
}

const Button = ({
  children,
  id,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className,
}: IButtonProps) => {
  const mergedClassName = twMerge(
    `rounded-lg text-base border-0 ${getVariantClasses(variant)}`,
    className
  );

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      className={mergedClassName}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
