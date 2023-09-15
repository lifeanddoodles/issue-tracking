type ButtonVariant = "accent" | "primary" | "secondary" | "link";

function getVariantClasses(variant: ButtonVariant) {
  switch (variant) {
    case "accent":
      return "text-white bg-accent hover:bg-accent-dark py-1 px-3";
    case "primary":
      return "text-white bg-primary hover:bg-primary-dark py-1 px-3";
    case "secondary":
      return "text-white bg-secondary hover:bg-secondary-dark py-1 px-3";
    case "link":
      return "text-primary hover:text-primary-dark hover:underline";
  }
}

const Button = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
}: {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded text-base border-0 ${getVariantClasses(variant)}`}
    >
      {label}
    </button>
  );
};

export default Button;
