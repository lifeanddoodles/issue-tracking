import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ObjectId } from "mongoose";
import React, { useEffect, useRef, useState } from "react";
import {
  ControllerType,
  FormElement,
  IFormControlProps,
  IFormStateProps,
  IOption,
} from "../../interfaces";
import IconButton from "../Button/IconButton";

export type nonBooleanValueType =
  | string
  | number
  | readonly string[]
  | ObjectId
  | Record<string, unknown>;

interface IFormControlWithActionsProps<T, U, V>
  extends IFormControlProps<U>,
    IFormStateProps {
  component: React.JSXElementConstructor<T>;
  value?: nonBooleanValueType;
  checked?: boolean;
  options?: IOption[];
  type?: ControllerType;
  onCancel: (target: U, initialValue: nonBooleanValueType | boolean) => void;
  onSave: () => void;
  url?: string;
  getFormattedOptions?: (data: V[]) => { value: string; label: string }[];
  showList?: boolean;
  currentList?: string[] | (ObjectId | Record<string, unknown>)[];
}

function FormControlWithActions<T, U extends FormElement, V>({
  component,
  value,
  checked,
  type,
  onChange,
  onCancel,
  onSave,
  options,
  ...props
}: IFormControlWithActionsProps<T, U, V>) {
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
        <IconButton
          onClick={handleToggleEdit}
          ariaLabel={
            isEditable
              ? `Save ${props.label?.replace(":", "")}`
              : `Edit ${props.label?.replace(":", "")}`
          }
        >
          {isEditable ? (
            <CheckIcon title="Save" />
          ) : (
            <PencilIcon title="Edit" />
          )}
        </IconButton>
        <IconButton
          onClick={handleCancel}
          disabled={!isEditable}
          ariaLabel={`Cancel changes to ${props.label?.replace(":", "")}`}
        >
          <XMarkIcon title="Cancel" />
        </IconButton>
      </div>
    </div>
  );
}

export default FormControlWithActions;
