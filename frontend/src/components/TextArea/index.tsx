import { useState } from "react";
import { twMerge } from "tailwind-merge";
import useValidation from "../../hooks/useValidation";
import { IFormControlProps, IFormStateProps } from "../../interfaces";

interface ITextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    IFormStateProps,
    IFormControlProps<HTMLTextAreaElement> {
  value?: string;
  placeholder?: string;
  className?: string;
  minLength?: number;
  "aria-invalid"?: boolean;
}

const TextArea = ({
  label,
  id,
  value,
  placeholder,
  className,
  onChange,
  errors,
  setErrors,
  required,
  disabled,
  ...props
}: ITextAreaProps) => {
  const [textAreaValue, setTextAreaValue] = useState(value);
  const { validateField } = useValidation();

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
    onChange && onChange(e);
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;

    if (setErrors)
      validateField({
        target,
        setErrors,
      });
  };

  const fieldHasErrors = errors && id && errors?.[id]?.length > 0;
  const mergedClassNames = twMerge(
    "text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 w-full rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out",
    className
  );

  return (
    <div role={label && "group"} className="flex flex-col mb-4">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        name={id}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        value={textAreaValue}
        placeholder={placeholder}
        required={required}
        {...props}
        aria-invalid={fieldHasErrors || false}
        aria-errormessage={`${id}-errors`}
        className={mergedClassNames}
        disabled={disabled}
      />
      {fieldHasErrors && (
        <ul
          id={`${id}-errors`}
          aria-live={fieldHasErrors ? "assertive" : "off"}
        >
          {errors?.[id]?.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextArea;
