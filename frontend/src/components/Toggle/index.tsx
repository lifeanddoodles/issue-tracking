import React, { useState } from "react";
import Input from "../Input";

interface IToggleProps {
  label?: string;
  id: string;
  checked: boolean;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  errors?: { [key: string]: string[] } | null;
  setErrors?: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] } | null>
  >;
  required?: boolean;
}

const Toggle = ({
  label,
  id,
  checked,
  onChange,
  errors,
  setErrors,
  required,
}: IToggleProps) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked((prev) => {
      e.target.checked = !prev;
      return !prev;
    });
    onChange && onChange(e);
  };

  return (
    <Input
      label={label}
      id={id}
      onChange={handleOnChange}
      checked={isChecked}
      required={required}
      errors={errors}
      setErrors={setErrors}
      type="checkbox"
      className={`mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-['']${
        isChecked
          ? " bg-primary after:absolute after:z-[2] after:-mt-[3px] after:ml-[1.0625rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-primary after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] focus:border-primary focus:bg-primary focus:before:ml-[1.0625rem] focus:before:scale-100 focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:bg-primary dark:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
          : ""
      }`}
    />
  );
};

export default Toggle;
