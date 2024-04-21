import {
  Children,
  Dispatch,
  ReactNode,
  SetStateAction,
  cloneElement,
  useEffect,
  useMemo,
} from "react";
import { getReadableInputName } from "../../utils";
import FormFieldControls from "../FormFieldControls";
import withControls from "./hoc/withControls";

const FieldWithControls = withControls(
  ({
    children,
    id,
    label,
    onCancel,
    onSave,
    isEditable,
    onToggleEdit,
    resetFieldValue,
    setResetFieldValue,
    disableToggleEdit,
  }: {
    children: ReactNode;
    id: string;
    label: string;
    onCancel: () => void;
    onSave: () => void;
    isEditable: boolean;
    onToggleEdit: () => void;
    resetFieldValue: boolean;
    setResetFieldValue: Dispatch<SetStateAction<boolean>>;
    disableToggleEdit: boolean;
  }) => {
    const formattedLabel = getReadableInputName(label?.replace(":", ""));
    const childWithNewProps = useMemo(() => {
      const childElement = Children.only(children) as JSX.Element;

      return cloneElement(childElement, {
        ...childElement.props,
        disabled: !isEditable,
        resetFieldValue,
        setResetFieldValue,
      });
    }, [children, isEditable, resetFieldValue, setResetFieldValue]);

    useEffect(() => {
      setResetFieldValue(true);
    }, [setResetFieldValue]);

    return (
      <div className="flex gap-2 items-center" data-testid={id}>
        {childWithNewProps}
        <FormFieldControls
          label={formattedLabel}
          onSave={onSave}
          onCancel={onCancel}
          isEditable={isEditable}
          onToggleEdit={onToggleEdit}
          disableToggleEdit={disableToggleEdit}
        />
      </div>
    );
  }
);

export default FieldWithControls;
