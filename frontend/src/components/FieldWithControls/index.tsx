import {
  Children,
  Dispatch,
  SetStateAction,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useFormFieldControls from "../../hooks/useFormFieldControls";
import { getReadableInputName } from "../../utils";
import FormFieldControls from "../FormFieldControls";

const withControls = (Component: JSX.ElementType) => {
  return ({
    label,
    children,
    onCancel,
    onSave,
  }: {
    label: string;
    children: React.ReactNode;
    onCancel: () => void;
    onSave: () => void;
  }) => {
    const [resetFieldValue, setResetFieldValue] = useState(false);
    const formattedLabel = getReadableInputName(label.replace(":", ""));
    const { isEditable, setIsEditable, onToggleEdit } = useFormFieldControls();

    const handleToggleEdit = useCallback(() => {
      onToggleEdit();
    }, [onToggleEdit]);

    const handleSave = useCallback(() => {
      onSave && onSave();
      handleToggleEdit();
    }, [handleToggleEdit, onSave]);

    const handleCancel = useCallback(() => {
      onCancel && onCancel();
      setResetFieldValue(true);
      setIsEditable(false);
    }, [onCancel, setIsEditable]);

    return (
      <Component
        children={children}
        isEditable={isEditable}
        label={formattedLabel}
        onToggleEdit={handleToggleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        resetFieldValue={resetFieldValue}
        setResetFieldValue={setResetFieldValue}
      />
    );
  };
};

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
