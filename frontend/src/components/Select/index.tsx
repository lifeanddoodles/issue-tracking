import { Fragment, useState } from "react";
import { twMerge } from "tailwind-merge";
import useValidation from "../../hooks/useValidation";

interface IOption {
  value: string | number;
  label?: string;
}

type Direction = "row" | "col" | "row-reverse" | "column-reverse";

interface ISelectProps {
  label?: string;
  id?: string;
  options: IOption[];
  value?: string | undefined;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors?: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string[];
    } | null>
  >;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  direction?: Direction;
}

const Select = ({
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
}: ISelectProps) => {
  const [selectValue, setSelectValue] = useState(value || "");
  const selectHasErrors = errors && errors?.[id!]?.length > 0;
  const { validateField } = useValidation();
  const mergeClassName = twMerge(
    `flex flex-${direction} mb-4 gap-2${
      direction === "row" ? " w-full flex-wrap" : ""
    }`,
    className
  );

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

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    label ? (
      <div role="group" className={mergeClassName}>
        {children}
      </div>
    ) : (
      <Fragment>{children}</Fragment>
    );

  return (
    <Wrapper>
      {label && (
        <label
          className={`${
            direction === "row"
              ? " basis-full max-w-1/3 shrink-0 sm:basis-1/3 md:basis-full lg:basis-1/3"
              : ""
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
        className={`text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-700 rounded-lg border focus:ring-blue-500 focus:border-blue-500 block p-2 pr-4 dark:placeholder-neutral-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full max-w-xs${
          !label ? " mb-4" : ""
        }${
          direction === "row"
            ? " basis-full max-w-2/3 shrink grow sm:basis-2/3 md:basis-full lg:basis-2/3"
            : ""
        }`}
        required={required}
        disabled={disabled}
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

export default Select;
