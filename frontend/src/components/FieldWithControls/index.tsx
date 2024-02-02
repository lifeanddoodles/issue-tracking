import {
  Children,
  Dispatch,
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
    label,
    onCancel,
    onSave,
    isEditable,
    onToggleEdit,
    resetFieldValue,
    setResetFieldValue,
  }: {
    children: React.ReactNode;
    label: string;
    onCancel: () => void;
    onSave: () => void;
    isEditable: boolean;
    onToggleEdit: () => void;
    resetFieldValue: boolean;
    setResetFieldValue: Dispatch<SetStateAction<boolean>>;
  }) => {
    const formattedLabel = getReadableInputName(label.replace(":", ""));
    const childWithNewProps = useMemo(() => {
      const childElement = Children.only(children);

      return cloneElement(childElement as JSX.Element, {
        ...(childElement as JSX.Element).props,
        disabled: !isEditable,
        resetFieldValue,
        setResetFieldValue,
      });
    }, [children, isEditable, resetFieldValue, setResetFieldValue]);

    useEffect(() => {
      setResetFieldValue(true);
    }, [setResetFieldValue]);

    return (
      <div className="flex gap-2 items-center">
        {childWithNewProps}
        <FormFieldControls
          label={formattedLabel}
          onSave={onSave}
          onCancel={onCancel}
          isEditable={isEditable}
          onToggleEdit={onToggleEdit}
        />
      </div>
    );
  }
);

export default FieldWithControls;
