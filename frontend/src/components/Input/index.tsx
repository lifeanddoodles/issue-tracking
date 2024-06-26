import { forwardRef, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import useValidation from "../../hooks/useValidation";
import {
  IBaseInputProps,
  IEmailInputProps,
  IPasswordInputProps,
  ITextInputProps,
} from "../../interfaces";

const Input = forwardRef(
  (
    {
      label,
      id,
      type,
      value,
      checked,
      className,
      onChange,
      resetFieldValue,
      setResetFieldValue,
      errors,
      setErrors,
      required,
      disabled,
      ...props
    }: IBaseInputProps & { wrapperProps?: Record<string, unknown> },
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const [inputValue, setInputValue] = useState(
      type !== "checkbox" ? value || "" : checked || false
    );
    const { validateField } = useValidation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { wrapperProps = {}, ...rest } = props;

    const handleReset = useCallback(() => {
      setInputValue((type !== "checkbox" ? value : checked)!);
      setResetFieldValue && setResetFieldValue(false);
    }, [type, value, checked, setResetFieldValue]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(type !== "checkbox" ? e.target.value : e.target.checked);
      onChange && onChange(e);
    };

    const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      if (setErrors)
        validateField({
          target,
          setErrors,
        });
    };

    useEffect(() => {
      if (resetFieldValue) handleReset();
    }, [handleReset, resetFieldValue]);

    const inputHasErrors = id && errors && errors?.[id]?.length > 0;
    const mergedClassNames = twMerge(
      "text-neutral-800 dark:text-neutral-100 disabled:text-neutral-500 disabled:dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 w-full rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out",
      className
    );

    return (
      <div role={label && "group"} className="w-full flex flex-col mb-4">
        {label && (
          <label htmlFor={id} className="font-semibold">
            {label}
          </label>
        )}
        <input
          type={type || "text"}
          id={id}
          name={id}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          value={typeof inputValue !== "boolean" ? inputValue || "" : undefined}
          checked={typeof inputValue === "boolean" && inputValue}
          required={required}
          {...rest}
          aria-invalid={inputHasErrors || false}
          aria-errormessage={`${id}-errors`}
          className={mergedClassNames}
          disabled={disabled}
          ref={ref}
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
  }
);

export const TextInput = forwardRef(
  (props: ITextInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return <Input {...props} type="text" ref={ref} />;
  }
);

export const EmailInput = forwardRef(
  (props: IEmailInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const emailPattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
    return (
      <Input
        {...props}
        type="email"
        pattern={props.pattern || emailPattern}
        ref={ref}
      />
    );
  }
);

export const PasswordInput = forwardRef(
  (props: IPasswordInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return <Input {...props} type="password" ref={ref} />;
  }
);

export const UrlInput = forwardRef(
  (props: IBaseInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return <Input {...props} type="url" ref={ref} />;
  }
);

export const CheckboxInput = forwardRef(
  (props: IBaseInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return <Input {...props} type="checkbox" ref={ref} />;
  }
);

export default Input;
