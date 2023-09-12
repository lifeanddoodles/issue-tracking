import { useEffect } from "react";
import useValidation from "../../hooks/useValidation";

interface IBaseInputProps {
  label?: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string[] } | null;
  setErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string[];
    } | null>
  >;
  required?: boolean;
  minLength?: number;
  "aria-invalid"?: boolean;
}

interface IEmailInputProps extends IBaseInputProps {
  pattern?: string;
}

const Input = ({
  label,
  id,
  type,
  value,
  onChange,
  errors,
  setErrors,
  required,
  ...props
}: IBaseInputProps | IEmailInputProps) => {
  const { validateInput } = useValidation();
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    validateInput({
      target,
      setErrors,
    });
  };

  const inputHasErrors = errors && errors?.[id]?.length > 0;

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type || "text"}
        id={id}
        name={id}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        value={value}
        required={required}
        {...props}
        aria-invalid={inputHasErrors || false}
        aria-errormessage={`${id}-errors`}
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
};

export default Input;
