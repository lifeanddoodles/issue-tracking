const Button = ({
  label,
  onClick,
  type = "button",
}: {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="text-white bg-accent hover:bg-accent-dark md:mr-auto inline-flex items-center border-0 py-1 px-3 rounded text-base mt-4 md:mt-0"
    >
      {label}
    </button>
  );
};

export default Button;
