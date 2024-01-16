import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useFormFieldControls from "../../hooks/useFormFieldControls";
import {
  CombinedProps,
  FormElement,
  IFieldProps,
  IFormControlWithActionsProps,
  nonBooleanValueType,
} from "../../interfaces";
import { getReadableInputName } from "../../utils";
import FormFieldControls from "../FormFieldControls";

const withControlsBase = <T extends FormElement, U extends IFieldProps>(
  onCancel: (
    resetKeyValue: Record<string, nonBooleanValueType | boolean>
  ) => void,
  onSave: () => void
) => {
  return (props: CombinedProps<IFormControlWithActionsProps<T>, U>) => {
    const MemoizedComponent = useMemo(() => props.component, [props.component]);
    const Component = MemoizedComponent as JSX.ElementType;
    const fieldRef = useRef<T | null>(null);
    const [initialValue, setInitialValue] = useState<
      nonBooleanValueType | boolean
    >(props.value || props?.checked);
    const [resetFieldValue, setResetFieldValue] = useState(false);
    const label = getReadableInputName(
      (props.label || props.id!).replace(":", "")
    );
    const { isEditable, setIsEditable, onToggleEdit } = useFormFieldControls();

    const handleToggleEdit = useCallback(() => {
      onToggleEdit();
    }, [onToggleEdit]);

    const handleSave = useCallback(() => {
      onSave && onSave();
      setInitialValue(
        fieldRef.current?.value ||
          (fieldRef.current as HTMLInputElement)?.checked
      );
      handleToggleEdit();
    }, [handleToggleEdit]);

    const handleCancel = useCallback(() => {
      onCancel && onCancel({ [props.id as string]: initialValue });
      setResetFieldValue(true);
      setIsEditable(false);
    }, [initialValue, props.id, setIsEditable]);

    return (
      <div className="flex gap-2 items-center">
        {
          <Component
            {...props}
            ref={fieldRef}
            disabled={!isEditable}
            resetFieldValue={resetFieldValue}
            setResetFieldValue={setResetFieldValue}
          />
        }
        <FormFieldControls
          isEditable={isEditable}
          label={label}
          onToggleEdit={handleToggleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  };
};

const withControls = <T extends FormElement, U extends IFieldProps>(
  onCancel: (
    resetKeyValue: Record<string, nonBooleanValueType | boolean>
  ) => void,
  onSave: () => void
) => memo(withControlsBase<T, U>(onCancel, onSave));

export default withControls;
