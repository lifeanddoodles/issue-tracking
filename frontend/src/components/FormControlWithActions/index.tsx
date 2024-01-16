import { ObjectId } from "mongoose";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ControllerType,
  FormElement,
  IFormControlProps,
  IFormStateProps,
  IOption,
  nonBooleanValueType,
} from "../../interfaces";
import { getReadableInputName } from "../../utils";
import FormFieldControls from "../FormFieldControls";

interface IFormControlWithActionsProps<T, U, V>
  extends IFormControlProps<U>,
    IFormStateProps {
  component: React.JSXElementConstructor<T>;
  value?: nonBooleanValueType;
  checked?: boolean;
  options?: IOption[];
  type?: ControllerType;
  onCancel: (
    resetKeyValue: Record<string, nonBooleanValueType | boolean>
  ) => void;
  onSave: () => void;
  url?: string;
  getFormattedOptions?: (data: V[]) => { value: string; label: string }[];
  showList?: boolean;
  currentList?: string[] | (ObjectId | Record<string, unknown>)[];
}

const FormControlWithActions = <T, U extends FormElement, V>({
  component,
  value,
  checked,
  type,
  onChange,
  onCancel,
  onSave,
  ...props
}: IFormControlWithActionsProps<T, U, V>): JSX.Element => {
  const Component = component as JSX.ElementType;
  const fieldRef = useRef<U | null>(null);
  const [fieldValue, setFieldValue] = useState<nonBooleanValueType>(
    !checked && value ? value.toString() : type === "number" ? 0 : ""
  );
  const [checkedValue, setCheckedValue] = useState<boolean>(
    (!value && checked) || false
  );
  const [initialValue, setInitialValue] = useState<
    nonBooleanValueType | boolean
  >(value ? value.toString() : checked || false);
  const [isEditable, setIsEditable] = useState(false);
  const [resetFieldValue, setResetFieldValue] = useState(false);
  const label = useMemo(
    () => getReadableInputName(props?.id!.replace(":", "")),
    [props?.id]
  );

  const handleToggleEdit = useCallback(() => {
    if (isEditable) {
      onSave && onSave();
      setInitialValue(fieldValue);
    }
    setIsEditable((prev) => !prev);
  }, [fieldValue, isEditable, onSave]);

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<U>) => {
      const changedValue =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : (e.target instanceof HTMLInputElement ||
              e.target instanceof HTMLSelectElement ||
              e.target instanceof HTMLTextAreaElement) &&
            e.target.value;
      value !== undefined &&
        typeof changedValue !== "boolean" &&
        setFieldValue(changedValue);
      checked !== undefined &&
        typeof changedValue === "boolean" &&
        setCheckedValue(changedValue);
      onChange && onChange(e);
    },
    [checked, onChange, value]
  );

  const handleCancel = useCallback(() => {
    value !== undefined &&
      typeof initialValue !== "boolean" &&
      setFieldValue(initialValue);
    checked !== undefined &&
      typeof initialValue === "boolean" &&
      setCheckedValue(initialValue);
    onCancel && onCancel({ [props.id as string]: initialValue! });
    setResetFieldValue(true);
    setIsEditable(false);
    setResetFieldValue(true);
    setIsEditable(false);
  }, [checked, initialValue, onCancel, props.id, value]);

  useEffect(() => {
    if (!isEditable && fieldValue !== undefined) {
      setInitialValue(fieldValue);
    }
  }, [isEditable, fieldValue]);

  return (
    <div className="flex gap-2 items-center">
      {/* TODO: Pass onSave and onCancel as props, group them together adjacently to form control */}
      <Component
        value={fieldValue}
        checked={checkedValue}
        onChange={handleOnChange}
        resetFieldValue={resetFieldValue}
        setResetFieldValue={setResetFieldValue}
        ref={fieldRef}
        disabled={!isEditable}
        type={type}
        {...props}
      />
      <FormFieldControls
        isEditable={isEditable}
        label={label}
        onToggleEdit={handleToggleEdit}
        onSave={onSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default FormControlWithActions;
