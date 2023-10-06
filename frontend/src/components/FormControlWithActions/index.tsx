import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import {
  ControllerType,
  IFormControlProps,
  IFormStateProps,
  IOption,
} from "../../interfaces";
import IconButton from "../Button/IconButton";

interface IFormControlWithActionsProps<T, U>
  extends IFormControlProps<U>,
    IFormStateProps {
  component: React.JSXElementConstructor<T>;
  value?: string | number | readonly string[];
  checked?: boolean;
  options?: IOption[];
  type?: ControllerType;
  onCancel: (
    target: U,
    initialValue: string | number | readonly string[] | boolean
  ) => void;
  onSave: () => void;
}

function FormControlWithActions<T, U extends HTMLElement>({
  component,
  value,
  checked,
  type,
  onChange,
  onCancel,
  onSave,
  options,
  ...props
}: IFormControlWithActionsProps<T, U>) {
  const Component = component as JSX.ElementType;
  const fieldRef = useRef<U | null>(null);
  const [fieldValue, setFieldValue] = useState<
    string | number | readonly string[]
  >(!checked && value ? value : type === "number" ? 0 : "");
  const [checkedValue, setCheckedValue] = useState<boolean>(
    (!value && checked) || false
  );
  const [initialValue, setInitialValue] = useState<
    string | number | readonly string[] | boolean
  >(value ? value : checked || false);
  const [isEditable, setIsEditable] = useState(false);
  const [resetFieldValue, setResetFieldValue] = useState(false);

  const handleToggleEdit = () => {
    if (isEditable) {
      onSave && onSave();
      setInitialValue(fieldValue);
    }
    setIsEditable((prev) => !prev);
  };

  const handleOnChange = (e: React.ChangeEvent<U>) => {
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
  };

  const handleCancel = () => {
    value !== undefined &&
      typeof initialValue !== "boolean" &&
      setFieldValue(initialValue);
    checked !== undefined &&
      typeof initialValue === "boolean" &&
      setCheckedValue(initialValue);
    onCancel && onCancel(fieldRef.current!, initialValue!);
    setResetFieldValue(true);
    setIsEditable(false);
    setResetFieldValue(true);
    setIsEditable(false);
  };

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
        options={options}
        {...props}
      />
      {/* TODO: Create custom hook for this, something like useFieldControls */}
      <div role="group" className="flex gap-2">
        <IconButton onClick={handleToggleEdit}>
          {isEditable ? (
            <CheckIcon title="Save" />
          ) : (
            <PencilIcon title="Edit" />
          )}
        </IconButton>
        <IconButton onClick={handleCancel} disabled={!isEditable}>
          <XMarkIcon title="Cancel" />
        </IconButton>
      </div>
    </div>
  );
}

export default FormControlWithActions;
