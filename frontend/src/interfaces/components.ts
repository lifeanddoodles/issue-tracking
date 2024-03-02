import { ObjectId } from "mongoose";
import { ElementType } from "react";
import { UserRole } from "../../../shared/interfaces";
import { ButtonVariant } from "../utils";

export type ControllerType =
  | "text"
  | "url"
  | "date"
  | "number"
  | "email"
  | "password"
  | "checkbox"
  | "radio";

export type nonBooleanValueType =
  | string
  | number
  | readonly string[]
  | ObjectId
  | Record<string, unknown>;

export type FormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type PermissionType = "VIEW" | "EDIT";

export type Permissions = Partial<{ [key in PermissionType]: UserRole[] }>;

export interface FormField {
  id: string;
  Component: ElementType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  fieldProps?: Record<string, unknown>;
  wrapperProps?: Record<string, unknown>;
  customFormProps?: Record<string, unknown>;
  permissions?: Permissions;
}

export interface FormFieldWithProps<T>
  extends FormField,
    Partial<Omit<IFormStateProps, "id">>,
    Partial<Omit<IFormControlProps<T>, "id">> {}

export interface IFormStateProps {
  errors?: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string[];
    } | null>
  >;
}

export interface IFormControlProps<T> {
  label?: string;
  id?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<T>) => void;
  onFocus?: (e: React.FocusEvent<T>) => void;
  required?: boolean;
  disabled?: boolean;
}

export interface IBaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    IFormStateProps {
  label?: string;
  type?: ControllerType;
  "aria-invalid"?: boolean;
  resetFieldValue?: boolean;
  setResetFieldValue?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ITextInputProps extends IBaseInputProps {
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
}

export interface ICheckboxOrRadioInputProps extends IBaseInputProps {
  checked?: boolean;
}

export interface IEmailInputProps extends IBaseInputProps {
  pattern?: string;
}

export interface IPasswordInputProps extends IBaseInputProps {
  pattern?: string;
  minLength?: number;
}

export interface IFileInputProps extends IBaseInputProps {
  accept?: string;
  multiple?: boolean;
}

export interface INumberInputProps extends IBaseInputProps {
  min?: number;
  max?: number;
}

export interface IOption {
  value: string | number;
  label?: string;
}

export type Direction = "row" | "col" | "row-reverse" | "column-reverse";

export interface ISelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    IFormStateProps {
  label?: string;
  options: IOption[];
  value?: string;
  direction?: Direction;
  resetFieldValue?: boolean;
  setResetFieldValue?: React.Dispatch<React.SetStateAction<boolean>>;
}

export enum ErrorType {
  REQUIRED = "REQUIRED",
  MINLENGTH = "MINLENGTH",
  PATTERN = "PATTERN",
  MISMATCH = "MISMATCH",
}

export interface IInputErrorOptions {
  minLength?: number;
  pattern?: string;
  idToCompare?: string;
}

export interface IInputErrorProps {
  id: string;
  type: ErrorType;
  options?: IInputErrorOptions;
}

export type IFieldProps =
  | ISelectProps
  | ITextInputProps
  | ICheckboxOrRadioInputProps;

export interface IFormControlWithActionsProps<T extends FormElement>
  extends IFormControlProps<T> {
  component: JSX.ElementType;
}

type ResetKeyValue = Record<string, boolean | nonBooleanValueType>;
export type IOnClickProps = React.MouseEvent<HTMLElement> | ResetKeyValue;

export interface IFormFieldControls {
  isEditable: boolean;
  label: string;
  onToggleEdit: () => void;
  onCancel: (resetKeyValue: IOnClickProps) => void;
  onSave: () => void;
  disableToggleEdit?: boolean;
}

export type CombinedProps<T, U> = T & U;

export interface IButtonProps {
  label?: string;
  children: React.ReactNode;
  id?: string;
  onClick?: (e: IOnClickProps) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}
