import { ButtonVariant, getVariantClasses } from "../../utils";

const Button = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
}: {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg text-base border-0 ${getVariantClasses(variant)}`}
    >
      {label}
    </button>
  );
};

export default Button;
