import { useState } from "react";

interface IOption {
  value: string;
  label?: string;
}
const Select = ({
  options,
  value,
  onChange,
}: {
  options: IOption[];
  value?: string | undefined;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  const [selectValue, setSelectValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    onChange && onChange(e);
  };

  return (
    <select
      value={value || selectValue}
      onChange={(e) => handleChange(e)}
      className="text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-700 rounded-lg border focus:ring-blue-500 focus:border-blue-500 block p-2 pr-4 dark:placeholder-neutral-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full max-w-xs"
    >
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </select>
  );
};

export default Select;
