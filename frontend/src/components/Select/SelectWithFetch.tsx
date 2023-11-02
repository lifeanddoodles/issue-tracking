import { Fragment, forwardRef, useCallback, useEffect } from "react";
import Select from ".";
import useFetch from "../../hooks/useFetch";
import {
  Direction,
  IFormControlProps,
  IFormStateProps,
} from "../../interfaces";

export interface ISelectWithFetchProps<T>
  extends IFormControlProps<HTMLSelectElement>,
    IFormStateProps {
  value: string;
  direction?: Direction;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  url: string;
  query?: string;
  getFormattedOptions: (data: T[]) => { value: string; label: string }[];
  showList?: boolean;
  currentList?: string[];
}

const SelectWithFetch = forwardRef(
  <T extends object>(
    {
      value,
      label,
      id,
      onChange,
      disabled,
      required,
      errors,
      setErrors,
      direction = "row",
      url,
      query = "",
      getFormattedOptions,
      showList = false,
      currentList,
    }: ISelectWithFetchProps<T>,
    ref: React.ForwardedRef<HTMLSelectElement>
  ): React.ReactElement => {
    const { data, loading, error, sendRequest } = useFetch<T[] | null>(null);

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      onChange && onChange(e);
    };

    const getOptionsList = useCallback(() => {
      sendRequest({ url: `${url}${query ? `?${query}` : ""}` });
    }, [url, query, sendRequest]);

    useEffect(() => {
      getOptionsList();
    }, [getOptionsList]);

    if (loading) {
      return (
        <p id={id} role="status">
          Loading...
        </p>
      );
    }

    if (error) {
      return (
        <p id={id} role="status">
          {error.message}
        </p>
      );
    }

    if (!data) {
      return (
        <p id={id} role="status">
          Resources not found
        </p>
      );
    }

    const resourceOptions = getFormattedOptions(data);
    const Wrapper = ({ children }: { children: React.ReactNode }) =>
      showList ? (
        <div role="group" className="flex flex-col">
          {children}
        </div>
      ) : (
        <Fragment>{children}</Fragment>
      );

    return (
      data && (
        <Wrapper>
          <Select
            label={label}
            id={id}
            value={value}
            options={[
              { value: "", label: "Select an option" },
              ...resourceOptions,
            ]}
            onChange={handleChange}
            required={required}
            errors={errors}
            setErrors={setErrors}
            direction={direction}
            disabled={disabled}
            ref={ref}
          />
          {showList && currentList && resourceOptions && (
            <ul>
              {resourceOptions
                .filter((option) =>
                  currentList.includes(option?.value as string)
                )
                .map((option) => (
                  <li key={option?.value}>{option?.label}</li>
                ))}
            </ul>
          )}
        </Wrapper>
      )
    );
  }
);

export default SelectWithFetch;
