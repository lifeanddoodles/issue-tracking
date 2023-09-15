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
      className="rounded"
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
