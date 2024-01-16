import Button, { IButtonProps } from ".";
import { nonBooleanValueType } from "../../interfaces";

type IOnClickProps =
  | React.MouseEvent<HTMLElement>
  | Record<string, nonBooleanValueType | boolean>;

interface IconButtonProps extends Omit<IButtonProps, "onClick"> {
  onClick: (e: IOnClickProps) => void;
}

const IconButton = ({ children, ...props }: IconButtonProps) => {
  return (
    <Button {...props} variant="icon">
      {children}
    </Button>
  );
};

export default IconButton;
