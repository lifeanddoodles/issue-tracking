import { useCallback, useState } from "react";
import useFormFieldControls from "../../../hooks/useFormFieldControls";
import { getReadableInputName } from "../../../utils";

const withControls = (Component: JSX.ElementType) => {
  return ({
    id,
    label,
    children,
    onCancel,
    onSave,
  }: {
    id: string;
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
        id={id}
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

export default withControls;
