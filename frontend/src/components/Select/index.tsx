import {
  ForwardRefRenderFunction,
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import useValidation from "../../hooks/useValidation";
import { ISelectProps } from "../../interfaces";

const SelectComponent: ForwardRefRenderFunction<
  HTMLSelectElement,
  ISelectProps
> = (
  {
    label,
    id,
    options,
    value,
    onChange,
    required,
    errors,
    setErrors,
    disabled,
    className,
    direction = "col",
    resetFieldValue,
    setResetFieldValue,
    ...props
  }: ISelectProps,
  ref: React.ForwardedRef<HTMLSelectElement>
) => {
  const [selectValue, setSelectValue] = useState(value || "");
  const selectHasErrors = errors && errors?.[id!]?.length > 0;
  const { validateField } = useValidation();
  const mergedClassName = twMerge(
    `flex flex-${direction} mb-4 gap-2${
      direction === "row" ? " w-full flex-wrap" : ""
    }`,
    className
  );
  const controlBaseClassName = `text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-700 rounded-lg border focus:ring-blue-500 focus:border-blue-500 block p-2 pr-4 dark:placeholder-neutral-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full${
    direction === "row" ? " shrink grow" : ""
  }`;
  const controlClassNames = !label
    ? twMerge(`${controlBaseClassName} mb-4`, className)
    : controlBaseClassName;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    onChange && onChange(e);
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    if (setErrors) {
      validateField({
        target,
        setErrors,
      });
    }
  };

  const handleReset = useCallback(() => {
    setSelectValue(value!);
    setResetFieldValue && setResetFieldValue(false);
  }, [value, setResetFieldValue]);

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    label ? (
      <div role="group" className={mergedClassName}>
        {children}
      </div>
    ) : (
      <Fragment>{children}</Fragment>
    );

  useEffect(() => {
    if (resetFieldValue) handleReset();
  }, [handleReset, resetFieldValue]);

  return (
    <Wrapper>
      {label && (
        <label
          className={`${
            direction === "row" ? " basis-full max-w-xs shrink-0" : ""
          }`}
          htmlFor={id}
        >
          <strong className="font-semibold">{label}</strong>
        </label>
      )}
      <select
        id={id}
        name={id}
        value={selectValue}
        onChange={(e) => handleChange(e)}
        onBlur={handleOnBlur}
        className={controlClassNames}
        required={required}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </select>
      {selectHasErrors && (
        <ul
          id={`${id}-errors`}
          aria-live={selectHasErrors ? "assertive" : "off"}
        >
          {errors?.[id!]?.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
};

const Select = forwardRef(SelectComponent);

export default Select;
