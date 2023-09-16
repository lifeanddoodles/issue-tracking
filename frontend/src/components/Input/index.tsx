import { useState } from "react";
import { twMerge } from "tailwind-merge";
import useValidation from "../../hooks/useValidation";

interface IBaseInputProps {
  label?: string;
  id: string;
  type?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors?: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string[];
    } | null>
  >;
  required?: boolean;
  minLength?: number;
  "aria-invalid"?: boolean;
}

interface IEmailInputProps extends IBaseInputProps {
  pattern?: string;
}

const Input = ({
  label,
  id,
  type,
  value,
  className,
  onChange,
  errors,
  setErrors,
  required,
  ...props
}: IBaseInputProps | IEmailInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const { validateInput } = useValidation();
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (setErrors)
      validateInput({
        target,
        setErrors,
      });
  };

  const inputHasErrors = errors && errors?.[id]?.length > 0;
  const mergedClassNames = twMerge(
    "text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 w-full rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out",
    className
  );

  return (
    <div role={label && "group"} className="flex flex-col mb-4">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type || "text"}
        id={id}
        name={id}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        value={value || inputValue}
        required={required}
        {...props}
        aria-invalid={inputHasErrors || false}
        aria-errormessage={`${id}-errors`}
        className={mergedClassNames}
      />
      {inputHasErrors && (
        <ul
          id={`${id}-errors`}
          aria-live={inputHasErrors ? "assertive" : "off"}
        >
          {errors?.[id]?.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Input;
