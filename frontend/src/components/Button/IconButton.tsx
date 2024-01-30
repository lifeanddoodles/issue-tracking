import Button from ".";
import { IButtonProps } from "../../interfaces";

const IconButton = ({ children, ...props }: IButtonProps) => {
  return (
    <Button {...props} variant="icon">
      {children}
    </Button>
  );
};

export default IconButton;
