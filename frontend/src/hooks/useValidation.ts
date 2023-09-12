export enum ErrorType {
  REQUIRED = "REQUIRED",
  MINLENGTH = "MINLENGTH",
  PATTERN = "PATTERN",
  MISMATCH = "MISMATCH",
}

interface IInputErrorOptions {
  minLength?: number;
  pattern?: string;
  idToCompare?: string;
}

interface IInputErrorProps {
  id: string;
  type: ErrorType;
  options?: IInputErrorOptions;
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

const addErrors = (
  id: string,
  errorText: string,
  errors: { [key: string]: string[] } | null
) => {
  if (
    errors === null ||
    (!!errors && (!errors?.[id] || !errors?.[id].includes(errorText)))
  ) {
    return {
      ...errors,
      [`${id}`]: [...(errors?.[id] ?? []), errorText],
    };
  }
  return errors;
};

const removeErrors = (
  id: string,
  errorText: string,
  errors: { [key: string]: string[] } | null
) => {
  const newErrors = () => {
    if (!!errors?.[id] && errors?.[id].includes(errorText)) {
      const filteredErrorsList = errors?.[id].filter((e) => e !== errorText);

      if (filteredErrorsList?.length === 0) {
        const tempErrors = { ...errors };
        delete tempErrors?.[id];
        return { ...tempErrors };
      }

      return {
        ...errors,
        [`${id}`]: [...(filteredErrorsList ?? [])],
      };
    }
    return { ...errors };
  };

  return Object.keys(newErrors()).length !== 0 ? newErrors() : null;
};

const useValidation = () => {
  function getErrorMessage({ id, type, options }: IInputErrorProps) {
    switch (type) {
      case ErrorType.REQUIRED:
        return `${getReadableInputName(id)} is required`;
      case ErrorType.MINLENGTH:
        return `${getReadableInputName(id)} must be at least ${
          options?.minLength
        } characters`;
      case ErrorType.PATTERN:
        return `${getReadableInputName(id)} must match the following pattern: ${
          options?.pattern
        }`;
      case ErrorType.MISMATCH:
        return `${getReadableInputName(id)} must match ${getReadableInputName(
          options?.idToCompare || "password"
        )}`;
      default:
        return `${getReadableInputName(id)} is not valid`;
    }
  }

  const updateErrors = (
    id: string,
    errorText: string,
    errors: { [key: string]: string[] } | null,
    addError: boolean = true,
    removeError: boolean = false
  ) => {
    if (addError && !removeError) {
      return addErrors(id, errorText, errors);
    }
    if (removeError && !addError) {
      return removeErrors(id, errorText, errors);
    }
    return errors;
  };

  function validateInput({
    target,
    setErrors,
    elementToCompare,
  }: {
    target: HTMLInputElement;
    setErrors: React.Dispatch<
      React.SetStateAction<{
        [key: string]: string[];
      } | null>
    >;
    elementToCompare?: { id: string; value: string };
  }) {
    const { id, value, pattern, minLength, required } = target;
    const errorRequiredText = getErrorMessage({ id, type: ErrorType.REQUIRED });
    const errorMinLengthText = getErrorMessage({
      id,
      type: ErrorType.MINLENGTH,
      options: { minLength },
    });
    const errorPatternText = getErrorMessage({
      id,
      type: ErrorType.MINLENGTH,
      options: { pattern },
    });
    const errorMismatchText = getErrorMessage({
      id,
      type: ErrorType.MISMATCH,
      options: { idToCompare: elementToCompare?.id },
    });

    if (required) {
      const shouldAdd = target.validity.valueMissing;
      const shouldRemove = value.length !== 0;

      setErrors((errors) =>
        updateErrors(id, errorRequiredText, errors, shouldAdd, shouldRemove)
      );
    }

    if (minLength) {
      const shouldAdd = target.validity.tooShort;
      const shouldRemove = value.length >= minLength;

      setErrors((errors) =>
        updateErrors(id, errorMinLengthText, errors, shouldAdd, shouldRemove)
      );
    }

    if (pattern) {
      const shouldAdd = !value.match(pattern);

      setErrors((errors) =>
        updateErrors(id, errorPatternText, errors, shouldAdd, !shouldAdd)
      );
    }

    if (elementToCompare) {
      const shouldAdd = value !== elementToCompare.value;

      setErrors((errors) =>
        updateErrors(id, errorMismatchText, errors, shouldAdd, !shouldAdd)
      );
    }
  }

  return {
    validateInput,
  };
};
export default useValidation;
