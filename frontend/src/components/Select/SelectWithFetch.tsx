import { Fragment, forwardRef, useCallback, useEffect } from "react";
import Select from ".";
import useFetch from "../../hooks/useFetch";
import { ISelectWithFetchProps } from "../../interfaces";

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
      showList,
      currentList,
      resetFieldValue,
      setResetFieldValue,
    }: ISelectWithFetchProps<T>,
    ref: React.ForwardedRef<HTMLSelectElement>
  ): React.ReactElement => {
    const { data, loading, error, sendRequest } = useFetch<T[] | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
            resetFieldValue={resetFieldValue}
            setResetFieldValue={setResetFieldValue}
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
