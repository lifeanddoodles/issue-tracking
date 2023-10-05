import Button, { IButtonProps } from ".";

interface IconButtonProps extends IButtonProps {}

const IconButton = ({ children, ...props }: IconButtonProps) => {
  return (
    <Button {...props} variant="icon">
      {children}
    </Button>
  );
};

export default IconButton;
