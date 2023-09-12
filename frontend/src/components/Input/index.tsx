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

function getReadableInputName(id: string) {
  switch (id) {
    case "firstName":
      return "First name";
    case "lastName":
      return "Last name";
    case "email":
      return "Email";
    case "password":
      return "Password";
    case "confirmPassword":
      return "Confirm password";
    case "company":
      return "Company";
    case "position":
      return "Position";
    default:
      return id;
  }
}

function validateInput({
  target,
  setErrors,
}: {
  target: HTMLInputElement;
  setErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string[];
    } | null>
  >;
}) {
  const { id, value, pattern, minLength, required } = target;
  if (required && value.length === 0) {
    setErrors((errors: { [key: string]: string[] } | null) => {
      return !errors?.[id].includes(`${getReadableInputName(id)} is required`)
        ? {
            ...errors,
            [`${id}`]: [
              ...(errors?.[id] ?? []),
              `${getReadableInputName(id)} is required`,
            ],
          }
        : errors;
    });
  }
  if (minLength && value.length < minLength) {
    setErrors((errors: { [key: string]: string[] } | null) => {
      return !errors?.[id].includes(
        `${getReadableInputName(id)} must be at least ${minLength} characters`
      )
        ? {
            ...errors,
            [`${id}`]: [
              ...(errors?.[id] ?? []),
              `${getReadableInputName(
                id
              )} must be at least ${minLength} characters`,
            ],
          }
        : errors;
    });
  }
  if (pattern && !value.match(pattern)) {
    setErrors((errors: { [key: string]: string[] } | null) => {
      return !errors?.[id].includes(
        `${getReadableInputName(
          id
        )} must match the following pattern: ${pattern}`
      )
        ? {
            ...errors,
            [`${id}`]: [
              ...(errors?.[id] ?? []),
              `${getReadableInputName(
                id
              )} must match the following pattern: ${pattern}`,
            ],
          }
        : errors;
    });
  }
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
