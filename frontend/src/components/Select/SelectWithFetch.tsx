import { useCallback, useEffect } from "react";
import Select from ".";
import {
  ITicketPopulatedDocument,
  IUserDocument,
} from "../../../../shared/interfaces";
import useFetch from "../../hooks/useFetch";

export type FetchedData =
  | Partial<ITicketPopulatedDocument>[]
  | Partial<IUserDocument>[];

export interface ISelectWithFetchProps {
  label?: string;
  id: string;
  value: string;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  disabled?: boolean;
  errors: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] } | null>
  >;
  url: string;
  query?: string;
  getFormattedOptions: (
    data: FetchedData
  ) => { value: string; label: string }[];
}

const SelectWithFetch = ({
  value,
  label,
  id,
  onChange,
  disabled,
  errors,
  setErrors,
  url,
  query = "",
  getFormattedOptions,
}: ISelectWithFetchProps) => {
  const { data, loading, error, sendRequest } = useFetch<FetchedData>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange && onChange(e);
  };

  const getOptionsList = useCallback(() => {
    sendRequest({ url: `${url}/${query}` });
  }, [url, query, sendRequest]);

  useEffect(() => {
    getOptionsList();
  }, [getOptionsList]);

  if (loading) {
    return <h1 role="status">Loading...</h1>;
  }

  if (error) {
    return <h1 role="status">{error.message}</h1>;
  }

  if (!data) {
    return <h1 role="status">Users not found</h1>;
  }

  return (
    data && (
      <>
        <Select
          label={label}
          id={id}
          value={value}
          options={[
            { value: "", label: "Click to assign" },
            ...getFormattedOptions(data),
          ]}
          onChange={handleChange}
          required
          errors={errors}
          setErrors={setErrors}
          className="grid grid-cols-[1fr_2fr]"
          disabled={disabled}
        />
      </>
    )
  );
};

export default SelectWithFetch;
