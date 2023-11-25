export type ControllerType =
  | "text"
  | "url"
  | "date"
  | "number"
  | "email"
  | "password"
  | "checkbox"
  | "radio";

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
